"use client"

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/context/ThemeContext';

interface Pixel {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  initialPos: THREE.Vector3;
  baseColor: THREE.Color;
}

export default function PixelSphere() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const previousMouseRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0 });
  const mouseWorldPosRef = useRef(new THREE.Vector3(10000, 10000, 10000));
  const mouseRayRef = useRef(new THREE.Raycaster());

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Use orthographic camera for zero perspective distortion
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 800;
    const camera = new THREE.OrthographicCamera(
      frustumSize * aspect / -2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      frustumSize / -2,
      1,
      2000
    );
    camera.position.z = 1000;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    containerRef.current.appendChild(renderer.domElement);

    // Add ambient light for MeshStandardMaterial
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    // Create pixel sphere with particles throughout volume
    const pixelSize = 2;
    const sphereRadius = 600; // Increased sphere size to take up more screen
    const pixels: Pixel[] = [];
    const numPixels = 100;

    // Generate pixels randomly distributed within the sphere
    for (let i = 0; i < numPixels; i++) {
      // Random position within sphere using rejection sampling
      let x, y, z, distance;
      do {
        x = (Math.random() - 0.5) * sphereRadius * 2;
        y = (Math.random() - 0.5) * sphereRadius * 2;
        z = (Math.random() - 0.5) * sphereRadius * 2;
        distance = Math.sqrt(x * x + y * y + z * z);
      } while (distance > sphereRadius);

      // Create pixel (small box)
      const geometry = new THREE.BoxGeometry(pixelSize, pixelSize, pixelSize);
      // Color based on theme: dark text color (#463535) for light mode, white for dark mode
      const pixelColor = theme === 'light' ? 0x7dd926 : 0xffffff;
      const material = new THREE.MeshStandardMaterial({
        color: pixelColor,
        emissive: pixelColor,
        emissiveIntensity: 0,
        metalness: 0.1,
        roughness: 0.5
      });
      const pixel = new THREE.Mesh(geometry, material);
      pixel.position.set(x, y, z);

      // Random velocity for flowing movement
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2
      );

      scene.add(pixel);
      pixels.push({
        mesh: pixel,
        velocity: velocity,
        initialPos: new THREE.Vector3(x, y, z),
        baseColor: new THREE.Color(pixelColor)
      });
    }

    // Mouse drag controls
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Convert mouse position to normalized device coordinates (-1 to +1)
      const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );

      // Update raycaster for hover detection
      mouseRayRef.current.setFromCamera(mouse, camera);

      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - previousMouseRef.current.x;
      const deltaY = e.clientY - previousMouseRef.current.y;

      rotationVelocityRef.current.y = deltaX * 0.01;
      rotationVelocityRef.current.x = deltaY * 0.01;

      previousMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleMouseLeave = () => {
      // Reset mouse ray to far away when mouse leaves
      mouseRayRef.current.ray.origin.set(10000, 10000, 10000);
      mouseRayRef.current.ray.direction.set(0, 0, -1);
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('mouseleave', handleMouseLeave);

    // Animation
    let animationId: number;
    let time = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.005;

      // Apply rotation velocity with damping
      rotationRef.current.x += rotationVelocityRef.current.x;
      rotationRef.current.y += rotationVelocityRef.current.y;

      // Damping
      rotationVelocityRef.current.x *= 0.95;
      rotationVelocityRef.current.y *= 0.95;

      // Rotate the entire scene
      scene.rotation.x = rotationRef.current.x;
      scene.rotation.y = rotationRef.current.y;

      // Animate pixels flowing around slowly
      pixels.forEach((pixelData) => {
        const pixel = pixelData.mesh;
        const vel = pixelData.velocity;

        // Get world position of pixel
        const worldPos = new THREE.Vector3();
        pixel.getWorldPosition(worldPos);

        // Calculate perpendicular distance from pixel to mouse ray
        const distToMouse = mouseRayRef.current.ray.distanceToPoint(worldPos);
        const hoverRadius = 200;

        // Apply hover effects
        if (distToMouse < hoverRadius) {
          const strength = 1 - (distToMouse / hoverRadius);

          // Glow effect - use emissive intensity for true glow
          const material = pixel.material as THREE.MeshStandardMaterial;
          material.emissiveIntensity = strength * 3.0;

          // Also brighten the base color
          const brightnessFactor = 1 + strength * 2.0;
          material.color.copy(pixelData.baseColor).multiplyScalar(brightnessFactor);

          // Scale up the pixel for extra emphasis
          const scale = 1;
          pixel.scale.set(scale, scale, scale);

          // Repulsion effect - push away from mouse ray
          // Find closest point on ray to pixel
          const closestPoint = new THREE.Vector3();
          mouseRayRef.current.ray.closestPointToPoint(worldPos, closestPoint);

          // Push away in world space, then convert to local space for velocity
          const repulsionDirWorld = worldPos.clone().sub(closestPoint).normalize();
          const repulsionForce = repulsionDirWorld.multiplyScalar(strength * 1.0);

          // Transform repulsion force to local space
          scene.updateMatrixWorld();
          const inverseMatrix = new THREE.Matrix4().copy(scene.matrixWorld).invert();
          repulsionForce.applyMatrix4(inverseMatrix).sub(
            new THREE.Vector3(0, 0, 0).applyMatrix4(inverseMatrix)
          );

          vel.add(repulsionForce);
        } else {
          // Reset to base color, size, and no glow when not hovering
          const material = pixel.material as THREE.MeshStandardMaterial;
          material.color.copy(pixelData.baseColor);
          material.emissiveIntensity = 0;
          pixel.scale.set(1, 1, 1);
        }

        // Move pixel
        pixel.position.x += vel.x;
        pixel.position.y += vel.y;
        pixel.position.z += vel.z;

        // Keep pixels within sphere bounds
        const distance = Math.sqrt(
          pixel.position.x ** 2 +
          pixel.position.y ** 2 +
          pixel.position.z ** 2
        );

        if (distance > sphereRadius) {
          // Bounce back towards center
          const normal = pixel.position.clone().normalize();
          vel.reflect(normal);
        }

        // Add slight random drift
        vel.x += (Math.random() - 0.5) * 0.01;
        vel.y += (Math.random() - 0.5) * 0.01;
        vel.z += (Math.random() - 0.5) * 0.01;

        // Limit velocity
        const speed = vel.length();
        if (speed > 0.3) {
          vel.normalize().multiplyScalar(0.3);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const aspect = window.innerWidth / window.innerHeight;
      camera.left = frustumSize * aspect / -2;
      camera.right = frustumSize * aspect / 2;
      camera.top = frustumSize / 2;
      camera.bottom = frustumSize / -2;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      pixels.forEach(pixelData => {
        pixelData.mesh.geometry.dispose();
        (pixelData.mesh.material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-screen"
      style={{ zIndex: 1, cursor: 'grab', pointerEvents: 'auto' }}
    />
  );
}
