"use client"

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Create smooth gradient blob using sphere geometry
    const geometry = new THREE.SphereGeometry(3, 64, 64);

    // Create custom shader material for vertical gradient
    const vertexShader = `
      varying vec3 vPosition;
      varying vec3 vNormal;

      void main() {
        vPosition = position;
        vNormal = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec3 vPosition;
      varying vec3 vNormal;

      void main() {
        // Normalize Y position from -1 to 1
        float normalizedY = vPosition.y / 3.0;

        vec3 color;

        // Create smooth vertical gradient matching the screenshot
        if (normalizedY > 0.7) {
          // Top: Yellow
          color = mix(vec3(1.0, 0.95, 0.4), vec3(1.0, 1.0, 0.8), (normalizedY - 0.7) / 0.3);
        } else if (normalizedY > 0.3) {
          // Yellow to Orange
          color = mix(vec3(1.0, 0.65, 0.0), vec3(1.0, 0.95, 0.4), (normalizedY - 0.3) / 0.4);
        } else if (normalizedY > 0.0) {
          // Orange to Red/Pink
          color = mix(vec3(0.9, 0.2, 0.4), vec3(1.0, 0.65, 0.0), normalizedY / 0.3);
        } else if (normalizedY > -0.3) {
          // Red/Pink to Purple
          color = mix(vec3(0.5, 0.1, 0.6), vec3(0.9, 0.2, 0.4), (normalizedY + 0.3) / 0.3);
        } else if (normalizedY > -0.6) {
          // Purple to Blue
          color = mix(vec3(0.2, 0.3, 0.8), vec3(0.5, 0.1, 0.6), (normalizedY + 0.6) / 0.3);
        } else {
          // Blue to Cyan
          color = mix(vec3(0.0, 0.7, 0.9), vec3(0.2, 0.3, 0.8), (normalizedY + 1.0) / 0.4);
        }

        // Calculate distance from center for radial fade
        float distanceFromCenter = length(vPosition) / 3.0;

        // Create smooth fade to transparent at edges
        float alpha = 1.0 - smoothstep(0.5, 1.0, distanceFromCenter);
        alpha = alpha * 0.8; // Overall transparency

        gl_FragColor = vec4(color, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending
    });

    const blob = new THREE.Mesh(geometry, material);
    blob.position.z = -2;
    scene.add(blob);

    // Store original vertices for morphing
    const originalPositions = geometry.attributes.position.array.slice();

    // Animation
    let animationId: number;
    let time = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.005;

      // Morph the blob
      const positions = geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        const x = originalPositions[i];
        const y = originalPositions[i + 1];
        const z = originalPositions[i + 2];

        // Apply gentle morphing
        const offset1 = Math.sin(time + x * 0.5) * 0.1;
        const offset2 = Math.sin(time * 0.7 + y * 0.5) * 0.1;
        const offset3 = Math.sin(time * 0.5 + z * 0.5) * 0.1;

        positions[i] = x * (1 + offset1);
        positions[i + 1] = y * (1 + offset2);
        positions[i + 2] = z * (1 + offset3);
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();

      // Slow rotation
      blob.rotation.y += 0.0005;
      blob.rotation.x = Math.sin(time * 0.3) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
