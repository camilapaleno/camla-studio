"use client"
import { useEffect, useRef } from 'react';

// ─── Model ────────────────────────────────────────────────────────────────────
// Drop any .glb into public/models/ and point this at it.
// Available: 'plum-branch.glb' | 'whispering-branch.glb' | 'hibiscus.glb'
const MODEL = '/models/arc-leaves.glb';

// ─── Particle count ───────────────────────────────────────────────────────────
const MAX_PARTICLES = 10_000;
const BLOOM_TIME    = Infinity;

// ─── Camera ───────────────────────────────────────────────────────────────────
// FOV in degrees. Lower = more telephoto/zoomed in. Higher = wider.
const CAMERA_FOV       = 25;
// 1.0 = branch fills the frame tightly, 1.5 = more breathing room, 0.8 = closer
const CAMERA_DIST_MULT = 1.1;
// Shift the camera horizontally or vertically from the branch center
const CAMERA_OFFSET_X  = 0;
const CAMERA_OFFSET_Y  = 0;

// ─── Branch angle ─────────────────────────────────────────────────────────────
// Y-axis rotation in radians, baked in at load time.
// 0 = front-facing, Math.PI / 6 = 30°, Math.PI / 4 = 45°, Math.PI / 2 = 90°
const FIXED_ANGLE = 0;

// ─── Drag rotation ────────────────────────────────────────────────────────────
// Radians rotated per pixel dragged.
const ROTATE_SENSITIVITY = 0.005;
// Velocity multiplier per frame after release (0.9 = fast stop, 0.98 = long coast).
const ROTATE_INERTIA     = 0.98;

// ─── Idle wobble ──────────────────────────────────────────────────────────────
// Per-axis shimmer amplitude. Set to 0 to freeze that axis.
const WOBBLE_X = 0.014;
const WOBBLE_Y = 0.012;
const WOBBLE_Z = 0.010;

// ─── Cursor avoidance ─────────────────────────────────────────────────────────
const REPEL_RADIUS   = 0.2; //0.15
const REPEL_STRENGTH = 0.009; //0.0009
const MAX_SPEED      = 0.002; // 0.002
// Velocity multiplier per frame. Higher = coasts longer.
const DAMPING        = .99;
// Displacement decay per frame — applied directly so it never oscillates.
const RETURN_DECAY   = 0.972;

// ─── Leaf drift ───────────────────────────────────────────────────────────────
// Max fraction of particles drifting at once (0.02 = 2 %, 0.1 = 10 %).
const DRIFT_FRACTION     = 0.04;
// Frames between spawn events. Lower = more frequent bursts.
const DRIFT_SPAWN_INTERVAL = 6;
// How particles are selected each spawn event.
// 'individual' = one-by-one  |  'clump' = nearby sphere  |  'line' = vertical strip
const DRIFT_MODE: 'individual' | 'clump' | 'line' = 'individual';
// How many particles to activate per individual-mode event.
const DRIFT_BURST_SIZE   = 4;
// World-unit radius of a clump (clump mode only).
const DRIFT_CLUMP_RADIUS = 0.15;
// World-unit half-width of the vertical strip (line mode only).
const DRIFT_LINE_WIDTH   = 0.05;
// Primary leftward speed in world units / frame.
const DRIFT_SPEED        = 0.0005;
// Downward fall speed in world units / frame.
const DRIFT_FALL         = 0.00015;
// ±fraction of base speed variation between particles (0 = all identical, 1 = 50 %–150 %).
const DRIFT_SPEED_VAR    = 0.6;
// Amplitude of the flutter wave in world units.
const DRIFT_WAVE_AMP     = 0.018;
// Angular frequency of the flutter (higher = faster flapping).
const DRIFT_WAVE_FREQ    = 0.022;
// How far left a particle travels before snapping back to rest.
const DRIFT_RESET_DIST   = 2.2;
// Frames a particle waits at rest before it can drift again (randomised ±50 %).
const DRIFT_RESPAWN_DELAY = 400;

// ─── Particle colours ─────────────────────────────────────────────────────────
const COLOR_NEAR = '#ffffff';
const COLOR_MID  = '#ffffff';
const COLOR_FAR  = '#ffffff';

// ─────────────────────────────────────────────────────────────────────────────

const VERT = /* glsl */`
uniform float uTime;
attribute vec3  aRestPos;
attribute vec2  aDispl;
attribute vec2  aDrift;
attribute float aOffset;
attribute float aSpeed;
varying float vDepth;

void main() {
  float t   = uTime * aSpeed + aOffset;
  vec3  pos = aRestPos;

  // Cursor-avoidance displacement (spring physics, CPU-computed)
  pos.x += aDispl.x;
  pos.y += aDispl.y;

  // Leaf-drift displacement (lifecycle physics, CPU-computed)
  pos.x += aDrift.x;
  pos.y += aDrift.y;

  // Idle shimmer
  pos.x += sin(t * 1.3 + aRestPos.z * 5.0) * ${WOBBLE_X.toFixed(4)};
  pos.y += cos(t * 0.9 + aRestPos.x * 4.0) * ${WOBBLE_Y.toFixed(4)};
  pos.z += sin(t * 1.1 + aRestPos.y * 3.0) * ${WOBBLE_Z.toFixed(4)};

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vDepth = clamp((-mv.z - 0.5) / 3.0, 0.0, 1.0);
  gl_PointSize = clamp(1.8 / -mv.z, 1.5, 3.5);
  gl_Position  = projectionMatrix * mv;
}
`;

const FRAG = /* glsl */`
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
varying float vDepth;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  if (dot(uv, uv) > 0.25) discard;

  vec3 col = mix(uColor1, uColor2, vDepth);
  col = mix(col, uColor3, clamp(vDepth * 2.0 - 0.5, 0.0, 1.0));
  gl_FragColor = vec4(col, 1.0);
}
`;

export default function ParticleBranch() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let rafId    = 0;
    let renderer: any = null;
    let geometry: any = null;
    let material: any = null;
    let ro: ResizeObserver | null = null;
    let disposed = false;

    let mouseClientX = -99999;
    let mouseClientY = -99999;

    const onMouseMove  = (e: MouseEvent) => { mouseClientX = e.clientX; mouseClientY = e.clientY; };
    const onMouseLeave = ()              => { mouseClientX = -99999;    mouseClientY = -99999; };

    let rotateY    = 0;
    let rotateVel  = 0;
    let isDragging = false;
    let lastDragX  = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastDragX  = e.clientX;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      rotateVel = (e.clientX - lastDragX) * ROTATE_SENSITIVITY;
      lastDragX = e.clientX;
    };
    const onPointerUp = () => { isDragging = false; };

    (async () => {
      const THREE = await import('three');
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');

      if (disposed) return;

      const W = mount.clientWidth  || window.innerWidth;
      const H = mount.clientHeight || window.innerHeight;

      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(CAMERA_FOV, W / H, 0.01, 100);

      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;cursor:crosshair;';
      mount.appendChild(renderer.domElement);

      renderer.domElement.addEventListener('mousemove',   onMouseMove);
      renderer.domElement.addEventListener('mouseleave',  onMouseLeave);
      renderer.domElement.addEventListener('pointerdown', onPointerDown);
      renderer.domElement.addEventListener('pointermove', onPointerMove);
      renderer.domElement.addEventListener('pointerup',   onPointerUp);
      renderer.domElement.addEventListener('pointerleave', onPointerUp);

      if (disposed) { renderer.dispose(); return; }

      const gltf = await new Promise<any>((resolve, reject) => {
        new GLTFLoader().load(MODEL, resolve, undefined, reject);
      });

      if (disposed) { renderer.dispose(); return; }

      if (gltf.animations?.length > 0) {
        const clip       = gltf.animations[0];
        const targetTime = Math.min(BLOOM_TIME, clip.duration);

        if (targetTime >= clip.duration) {
          const byName = new Map<string, any>();
          gltf.scene.traverse((nd: any) => byName.set(nd.name, nd));
          for (const track of clip.tracks as any[]) {
            const dot  = track.name.lastIndexOf('.');
            const obj  = byName.get(track.name.slice(0, dot));
            const prop = track.name.slice(dot + 1);
            if (!obj) continue;
            const last = track.times.length - 1;
            const v    = track.values;
            if      (prop === 'quaternion') obj.quaternion.set(v[last*4], v[last*4+1], v[last*4+2], v[last*4+3]);
            else if (prop === 'position')   obj.position.set(v[last*3], v[last*3+1], v[last*3+2]);
            else if (prop === 'scale')      obj.scale.set(v[last*3], v[last*3+1], v[last*3+2]);
          }
        } else {
          const mixer  = new THREE.AnimationMixer(gltf.scene);
          const action = mixer.clipAction(clip);
          action.setLoop(THREE.LoopOnce, 1);
          action.clampWhenFinished = true;
          action.play();
          mixer.setTime(targetTime);
        }

        gltf.scene.traverse((nd: any) => { if (!nd.matrixAutoUpdate) nd.updateMatrix(); });
        gltf.scene.updateMatrixWorld(true);
      }

      const allPos: number[] = [];
      gltf.scene.traverse((node: any) => {
        if (!node.isMesh) return;
        node.updateWorldMatrix(true, false);
        const attr = node.geometry.attributes.position;
        const mat  = node.matrixWorld;
        for (let i = 0; i < attr.count; i++) {
          const v = new THREE.Vector3(attr.getX(i), attr.getY(i), attr.getZ(i));
          v.applyMatrix4(mat);
          allPos.push(v.x, v.y, v.z);
        }
      });

      let minX=Infinity, maxX=-Infinity, minY=Infinity, maxY=-Infinity,
          minZ=Infinity, maxZ=-Infinity;
      for (let i = 0; i < allPos.length; i += 3) {
        minX = Math.min(minX, allPos[i]);   maxX = Math.max(maxX, allPos[i]);
        minY = Math.min(minY, allPos[i+1]); maxY = Math.max(maxY, allPos[i+1]);
        minZ = Math.min(minZ, allPos[i+2]); maxZ = Math.max(maxZ, allPos[i+2]);
      }

      const cx   = (minX + maxX) / 2;
      const cy   = (minY + maxY) / 2;
      const midZ = (minZ + maxZ) / 2;
      const sizeX = maxX - minX;
      const sizeY = maxY - minY;

      const fovRad       = CAMERA_FOV * Math.PI / 180;
      const halfFovVert  = fovRad / 2;
      const halfFovHoriz = Math.atan(Math.tan(halfFovVert) * camera.aspect);
      const distForY     = (sizeY / 2) / Math.tan(halfFovVert);
      const distForX     = (sizeX / 2) / Math.tan(halfFovHoriz);
      const camDist      = Math.max(distForY, distForX) * CAMERA_DIST_MULT;

      camera.position.set(CAMERA_OFFSET_X, CAMERA_OFFSET_Y, camDist);
      camera.lookAt(CAMERA_OFFSET_X, CAMERA_OFFSET_Y, 0);

      // ── Build particle buffers ─────────────────────────────────────────────
      const total = Math.floor(allPos.length / 3);
      const step  = Math.max(1, Math.floor(total / MAX_PARTICLES));
      const n     = Math.ceil(total / step);

      const restPos = new Float32Array(n * 3);
      const offsets = new Float32Array(n);
      const speeds  = new Float32Array(n);

      const cosA = Math.cos(FIXED_ANGLE);
      const sinA = Math.sin(FIXED_ANGLE);

      let k = 0;
      for (let i = 0; i < total; i += step) {
        const x = allPos[i * 3]     - cx;
        const y = allPos[i * 3 + 1] - cy;
        const z = allPos[i * 3 + 2] - midZ;
        restPos[k * 3]     = x * cosA + z * sinA;
        restPos[k * 3 + 1] = y;
        restPos[k * 3 + 2] = -x * sinA + z * cosA;
        offsets[k] = Math.random() * Math.PI * 2;
        speeds[k]  = 0.55 + Math.random() * 0.35;
        k++;
      }

      // Compute actual restPos X range (used by line-mode spawn)
      let restMinX = Infinity, restMaxX = -Infinity;
      for (let i = 0; i < n; i++) {
        restMinX = Math.min(restMinX, restPos[i*3]);
        restMaxX = Math.max(restMaxX, restPos[i*3]);
      }

      // ── Cursor-avoidance physics state ────────────────────────────────────
      const velX       = new Float32Array(n);
      const velY       = new Float32Array(n);
      const displData  = new Float32Array(n * 2);
      const repelRadSq = REPEL_RADIUS * REPEL_RADIUS;

      // ── Leaf-drift state ──────────────────────────────────────────────────
      // driftActive:  0 = at rest / waiting,  1 = drifting
      // driftDelay:   frames remaining before eligible to drift again
      // driftTimer:   frames since this drift cycle started
      // driftSpdMult: per-particle speed multiplier (randomised at activation)
      // driftPhaseX/Y: random wave phase baked at activation
      // driftData:    current XY drift displacement uploaded to GPU each frame
      const driftActive  = new Uint8Array(n);
      const driftDelay   = new Float32Array(n);
      const driftTimer   = new Float32Array(n);
      const driftSpdMult = new Float32Array(n);
      const driftPhaseX  = new Float32Array(n);
      const driftPhaseY  = new Float32Array(n);
      const driftData    = new Float32Array(n * 2);

      // Stagger initial delays so particles don't all become eligible at once
      for (let i = 0; i < n; i++) {
        driftDelay[i] = Math.random() * DRIFT_RESPAWN_DELAY;
      }

      let activeDriftCount = 0;
      let spawnTimer       = DRIFT_SPAWN_INTERVAL;

      const activateDrift = (i: number): boolean => {
        if (driftActive[i] || driftDelay[i] > 0) return false;
        driftActive[i]  = 1;
        driftTimer[i]   = 0;
        driftSpdMult[i] = 1 - DRIFT_SPEED_VAR * 0.5 + Math.random() * DRIFT_SPEED_VAR;
        driftPhaseX[i]  = Math.random() * Math.PI * 2;
        driftPhaseY[i]  = Math.random() * Math.PI * 2;
        activeDriftCount++;
        return true;
      };

      const spawnDrift = () => {
        const cap = Math.floor(n * DRIFT_FRACTION);
        if (activeDriftCount >= cap) return;

        if (DRIFT_MODE === 'clump') {
          // Pick a random existing particle as the clump centre
          const ci  = Math.floor(Math.random() * n);
          const ccx = restPos[ci * 3];
          const ccy = restPos[ci * 3 + 1];
          const rSq = DRIFT_CLUMP_RADIUS * DRIFT_CLUMP_RADIUS;
          for (let i = 0; i < n && activeDriftCount < cap; i++) {
            const ddx = restPos[i*3]   - ccx;
            const ddy = restPos[i*3+1] - ccy;
            if (ddx*ddx + ddy*ddy < rSq) activateDrift(i);
          }

        } else if (DRIFT_MODE === 'line') {
          // Pick a random X in the model's X range, activate a vertical strip
          const lineX = restMinX + Math.random() * (restMaxX - restMinX);
          for (let i = 0; i < n && activeDriftCount < cap; i++) {
            if (Math.abs(restPos[i*3] - lineX) < DRIFT_LINE_WIDTH) activateDrift(i);
          }

        } else {
          // individual — activate DRIFT_BURST_SIZE random particles
          let spawned = 0;
          let tries   = 0;
          while (spawned < DRIFT_BURST_SIZE && tries < n && activeDriftCount < cap) {
            const i = Math.floor(Math.random() * n);
            if (activateDrift(i)) spawned++;
            tries++;
          }
        }
      };

      // ── Geometry & material ───────────────────────────────────────────────
      geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(restPos.slice(), 3));
      geometry.setAttribute('aRestPos', new THREE.BufferAttribute(restPos, 3));
      geometry.setAttribute('aOffset',  new THREE.BufferAttribute(offsets, 1));
      geometry.setAttribute('aSpeed',   new THREE.BufferAttribute(speeds, 1));

      const displAttr = new THREE.BufferAttribute(displData, 2);
      displAttr.usage = THREE.DynamicDrawUsage;
      geometry.setAttribute('aDispl', displAttr);

      const driftAttr = new THREE.BufferAttribute(driftData, 2);
      driftAttr.usage = THREE.DynamicDrawUsage;
      geometry.setAttribute('aDrift', driftAttr);

      material = new THREE.ShaderMaterial({
        uniforms: {
          uTime:   { value: 0 },
          uColor1: { value: new THREE.Color(COLOR_NEAR) },
          uColor2: { value: new THREE.Color(COLOR_MID) },
          uColor3: { value: new THREE.Color(COLOR_FAR) },
        },
        vertexShader:   VERT,
        fragmentShader: FRAG,
      });

      const points = new THREE.Points(geometry, material);
      points.frustumCulled = false;
      scene.add(points);

      const clock = new THREE.Clock();
      const _near = new THREE.Vector3();
      const _far  = new THREE.Vector3();
      const _dir  = new THREE.Vector3();

      ro = new ResizeObserver(() => {
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      });
      ro.observe(mount);

      const tick = () => {
        if (disposed) return;
        rafId = requestAnimationFrame(tick);

        // ── Mouse → world projection ────────────────────────────────────────
        let mx = -9999, my = -9999;
        const rect = mount.getBoundingClientRect();
        const ndcX = ((mouseClientX - rect.left) / rect.width)  * 2 - 1;
        const ndcY = -((mouseClientY - rect.top)  / rect.height) * 2 + 1;

        if (mouseClientX > -99000 && ndcX >= -1.1 && ndcX <= 1.1) {
          _near.set(ndcX, ndcY, -1).unproject(camera);
          _far .set(ndcX, ndcY,  1).unproject(camera);
          _dir .copy(_far).sub(_near).normalize();
          if (Math.abs(_dir.z) > 0.001) {
            const t = -_near.z / _dir.z;
            mx = _near.x + _dir.x * t;
            my = _near.y + _dir.y * t;
          }
        }

        // ── Drift spawn ─────────────────────────────────────────────────────
        if (--spawnTimer <= 0) {
          spawnTimer = DRIFT_SPAWN_INTERVAL;
          spawnDrift();
        }

        // ── Per-particle loop ────────────────────────────────────────────────
        for (let i = 0; i < n; i++) {
          const di = i * 2;
          const ri = i * 3;

          // ── Cursor avoidance ──────────────────────────────────────────────
          const adx = restPos[ri]   + displData[di]   - mx;
          const ady = restPos[ri+1] + displData[di+1] - my;
          const distSq = adx * adx + ady * ady;

          if (distSq < repelRadSq && distSq > 1e-9) {
            const dist  = Math.sqrt(distSq);
            const tt    = 1 - dist / REPEL_RADIUS;
            const force = tt * tt * REPEL_STRENGTH;
            velX[i] += (adx / dist) * force;
            velY[i] += (ady / dist) * force;
          }

          const spd = Math.sqrt(velX[i] * velX[i] + velY[i] * velY[i]);
          if (spd > MAX_SPEED) {
            const inv = MAX_SPEED / spd;
            velX[i] *= inv;
            velY[i] *= inv;
          }

          velX[i] *= DAMPING;
          velY[i] *= DAMPING;

          displData[di]   += velX[i];
          displData[di+1] += velY[i];
          displData[di]   *= RETURN_DECAY;
          displData[di+1] *= RETURN_DECAY;

          // ── Leaf drift ────────────────────────────────────────────────────
          if (driftDelay[i] > 0) {
            // Waiting — tick down the delay, keep drift at zero
            driftDelay[i]--;
            driftData[di]   = 0;
            driftData[di+1] = 0;

          } else if (driftActive[i]) {
            // Drifting — compute displacement as a pure function of age
            // (no accumulation, so it can never diverge or oscillate)
            driftTimer[i]++;
            const age  = driftTimer[i];
            const sm   = driftSpdMult[i];

            // Primary leftward path + gentle downward fall
            const baseX = -(DRIFT_SPEED * age * sm);
            const baseY = -(DRIFT_FALL  * age * sm);

            // Flutter wave: oscillates around the drift path
            // Using age*sm so faster particles also flutter faster (physical)
            const waveX = DRIFT_WAVE_AMP * Math.sin(DRIFT_WAVE_FREQ * age * sm + driftPhaseX[i]);
            const waveY = DRIFT_WAVE_AMP * 0.55 * Math.sin(DRIFT_WAVE_FREQ * age * sm * 0.65 + driftPhaseY[i]);

            driftData[di]   = baseX + waveX;
            driftData[di+1] = baseY + waveY;

            // Reset once particle has travelled far enough left
            if (-driftData[di] > DRIFT_RESET_DIST) {
              driftActive[i]  = 0;
              driftTimer[i]   = 0;
              driftData[di]   = 0;
              driftData[di+1] = 0;
              driftDelay[i]   = DRIFT_RESPAWN_DELAY * (0.5 + Math.random());
              activeDriftCount--;
            }

          } else {
            driftData[di]   = 0;
            driftData[di+1] = 0;
          }
        }

        displAttr.needsUpdate = true;
        driftAttr.needsUpdate = true;

        rotateY += rotateVel;
        if (!isDragging) rotateVel *= ROTATE_INERTIA;
        points.rotation.y = rotateY;

        material.uniforms.uTime.value = clock.getElapsedTime();
        renderer.render(scene, camera);
      };
      tick();
    })().catch(console.error);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro?.disconnect();
      if (renderer) {
        renderer.domElement.removeEventListener('mousemove',   onMouseMove);
        renderer.domElement.removeEventListener('mouseleave',  onMouseLeave);
        renderer.domElement.removeEventListener('pointerdown', onPointerDown);
        renderer.domElement.removeEventListener('pointermove', onPointerMove);
        renderer.domElement.removeEventListener('pointerup',   onPointerUp);
        renderer.domElement.removeEventListener('pointerleave', onPointerUp);
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
        renderer.dispose();
      }
      geometry?.dispose();
      material?.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}
