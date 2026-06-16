"use client"
import { useEffect, useRef } from 'react';

// ─── Particle count ───────────────────────────────────────────────────────────
// Higher = denser cloud but heavier on GPU. 5_000–20_000 is a good range.
const MAX_PARTICLES = 20_000;

// ─── Starting rotation ────────────────────────────────────────────────────────
// Drag the flower to the angle where it looks best, then paste that value here.
// In radians: 0 = default, Math.PI = 180°, Math.PI / 2 = 90°, etc.
// Tip: add a temporary console.log(rot) inside onMove to read the current angle.
const INITIAL_ROT = 0;

// ─── Animation frame to sample ────────────────────────────────────────────────
// The GLB contains a bloom animation. This picks which moment in that animation
// the particles are "frozen" at.
// Infinity = last frame (fully open). 0 = first frame (fully closed).
// Any number between 0 and the clip's duration works, e.g. clip.duration * 0.75.
// Tip: log gltf.animations[0]?.duration after loading to see the full length.
const BLOOM_TIME = Infinity;

const VERT = /* glsl */`
uniform float uTime;
uniform float uRot;
attribute vec3 aRestPos;
attribute float aOffset;
attribute float aSpeed;
varying float vDepth;

void main() {
  float t = uTime * aSpeed + aOffset;
  vec3 pos = aRestPos;

  // ── Particle wobble ────────────────────────────────────────────────────────
  // The three multipliers (0.014, 0.012, 0.010) are the wobble amplitude.
  // Increase for a more "breathing" effect, decrease to keep particles tighter.
  pos.x += sin(t * 1.3 + aRestPos.z * 5.0) * 0.014;
  pos.y += cos(t * 0.9 + aRestPos.x * 4.0) * 0.012;
  pos.z += sin(t * 1.1 + aRestPos.y * 3.0) * 0.010;

  // Rotate around Z axis (the stem) — X and Y spin, Z stays fixed
  float c = cos(uRot);
  float s = sin(uRot);
  pos = vec3(pos.x * c - pos.y * s, pos.x * s + pos.y * c, pos.z);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vDepth = clamp((-mv.z - 0.05) / 1.5, 0.0, 1.0);

  // ── Particle size ──────────────────────────────────────────────────────────
  // 1.8 = base size multiplier. Increase for bigger dots.
  // The clamp(x, 1.0, 3.5) sets min and max pixel size.
  gl_PointSize = clamp(1.8 / -mv.z, 1.0, 3.5);
  gl_Position = projectionMatrix * mv;
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

  // Particles blend from uColor1 (near) → uColor2 → uColor3 (far)
  vec3 col = mix(uColor1, uColor2, vDepth);
  col = mix(col, uColor3, clamp(vDepth * 2.0 - 0.5, 0.0, 1.0));
  gl_FragColor = vec4(col, 1.0);
}
`;

export default function ParticleFlower() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let rafId = 0;
    let renderer: any = null;
    let geometry: any = null;
    let material: any = null;
    let ro: ResizeObserver | null = null;
    let disposed = false;

    let rot      = INITIAL_ROT;
    let velRot   = 0;
    let isDragging = false;
    let lastX = 0;

    // ── Drag sensitivity ─────────────────────────────────────────────────────
    // 0.005 = how fast the flower spins per pixel dragged. Increase to spin faster.
    const DRAG_SPEED = 0.002;

    // ── Spin inertia ─────────────────────────────────────────────────────────
    // 0.92 = how much velocity is kept each frame after releasing.
    // 1.0 = never stops, 0.0 = stops instantly.
    const INERTIA = 0.92;

    const onDown = (e: PointerEvent) => {
      isDragging = true; lastX = e.clientX; velRot = 0;
      if (renderer) renderer.domElement.style.cursor = 'grabbing';
    };
    const onMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      velRot = dx * DRAG_SPEED;
      rot   += velRot;
      lastX  = e.clientX;
    };
    const onUp = () => {
      isDragging = false;
      if (renderer) renderer.domElement.style.cursor = 'grab';
    };

    (async () => {
      const THREE = await import('three');
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');

      if (disposed) return;

      const W = mount.clientWidth || 600;
      const H = mount.clientHeight || 480;

      const scene  = new THREE.Scene();

      // ── Field of view ───────────────────────────────────────────────────────
      // 70 = degrees. Lower = more zoomed in (telephoto). Higher = wider angle.
      const camera = new THREE.PerspectiveCamera(70, W / H, 0.01, 100);

      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;cursor:grab;';
      mount.appendChild(renderer.domElement);

      renderer.domElement.addEventListener('pointerdown', onDown);
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup',   onUp);

      if (disposed) { renderer.dispose(); return; }

      const gltf = await new Promise<any>((resolve, reject) => {
        // ── 3D model ──────────────────────────────────────────────────────────
        // Swap the path to use a different GLB file.
        new GLTFLoader().load(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/models/hibiscus.glb`, resolve, undefined, reject);
      });

      if (disposed) { renderer.dispose(); return; }

      // Apply bloom frame: move each petal/pistil/sepal object to the desired pose.
      // The animation animates whole object transforms, not bones.
      if (gltf.animations?.length > 0) {
        const clip       = gltf.animations[0];
        const targetTime = Math.min(BLOOM_TIME, clip.duration);

        if (targetTime >= clip.duration) {
          // Last frame: read the final keyframe of every track directly — avoids
          // any AnimationMixer loop/wrap-around issues.
          const byName = new Map<string, any>();
          gltf.scene.traverse((n: any) => byName.set(n.name, n));

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
          // Mid-bloom: interpolate at the requested time via AnimationMixer.
          const mixer  = new THREE.AnimationMixer(gltf.scene);
          const action = mixer.clipAction(clip);
          action.setLoop(THREE.LoopOnce, 1);
          action.clampWhenFinished = true;
          action.play();
          mixer.setTime(targetTime);
        }

        // GLTFLoader sets matrixAutoUpdate=false on all nodes, so setting
        // position/quaternion/scale does NOT recompute the local matrix automatically.
        // We must call updateMatrix() explicitly before propagating world matrices.
        gltf.scene.traverse((n: any) => { if (!n.matrixAutoUpdate) n.updateMatrix(); });
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

      // ── Camera position & aim ───────────────────────────────────────────────
      // The stem runs along the Z axis. camera.up=(0,0,-1) keeps the flower upright.
      //
      // camera.position.set(X, Y, Z):
      //   X — distance from stem. Decrease to zoom in, increase to zoom out.
      //   Y — vertical offset. Positive = camera moves up (world Y).
      //   Z — moves toward flower head (more negative) or pot (more positive).
      //       The flower head is in the -Z direction.
      //
      // camera.lookAt(X, Y, Z):
      //   Aim the camera at this world point. Match the Z to camera.position Z
      //   to keep the view level, or make it less negative to tilt down slightly.
      camera.up.set(0, 0, -0.8);
      camera.position.set(0.4, 0, -0.4);
      camera.lookAt(0, 0, -0.3);

      const total = Math.floor(allPos.length / 3);
      const step  = Math.max(1, Math.floor(total / MAX_PARTICLES));
      const n     = Math.ceil(total / step);

      const restPos = new Float32Array(n * 3);
      const offsets = new Float32Array(n);
      const speeds  = new Float32Array(n);

      let k = 0;
      for (let i = 0; i < total; i += step) {
        restPos[k * 3]     = allPos[i * 3]     - cx;
        restPos[k * 3 + 1] = allPos[i * 3 + 1] - cy;
        restPos[k * 3 + 2] = allPos[i * 3 + 2] - midZ;
        offsets[k] = Math.random() * Math.PI * 2;
        // ── Animation speed per particle ──────────────────────────────────────
        // Range 0.25–0.60. Widen the range for more variation, narrow it for
        // a more uniform ripple.
        speeds[k]  = 0.55 + Math.random() * 0.35;
        k++;
      }

      geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(restPos.slice(), 3));
      geometry.setAttribute('aRestPos', new THREE.BufferAttribute(restPos, 3));
      geometry.setAttribute('aOffset',  new THREE.BufferAttribute(offsets, 1));
      geometry.setAttribute('aSpeed',   new THREE.BufferAttribute(speeds, 1));

      material = new THREE.ShaderMaterial({
        uniforms: {
          uTime:   { value: 0 },
          uRot:    { value: 0 },
          // ── Particle colours ────────────────────────────────────────────────
          // uColor1 = near/front particles
          // uColor2 = mid-depth particles
          // uColor3 = far/back particles
          uColor1: { value: new THREE.Color('#fff') },
          uColor2: { value: new THREE.Color('#fff') },
          uColor3: { value: new THREE.Color('#fff') },
        },
        vertexShader:   VERT,
        fragmentShader: FRAG,
      });

      const points = new THREE.Points(geometry, material);
      points.frustumCulled = false;
      scene.add(points);

      const clock = new THREE.Clock();

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
        if (!isDragging) { rot += velRot; velRot *= INERTIA; }
        material.uniforms.uRot.value   = rot;
        material.uniforms.uTime.value  = clock.getElapsedTime();
        renderer.render(scene, camera);
      };
      tick();
    })().catch(console.error);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro?.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup',   onUp);
      if (renderer) {
        renderer.domElement.removeEventListener('pointerdown', onDown);
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
        renderer.dispose();
      }
      geometry?.dispose();
      material?.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}
