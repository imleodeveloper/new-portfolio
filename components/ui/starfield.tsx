"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function Starfield() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, premultipliedAlpha: false });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    mountRef.current.appendChild(renderer.domElement);

    // ── Circular star texture (radial gradient → round particles) ────────────
    const starCanvas = document.createElement("canvas");
    starCanvas.width = 64; starCanvas.height = 64;
    const sCtx = starCanvas.getContext("2d")!;
    const grad = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0,    "rgba(255,255,255,1)");
    grad.addColorStop(0.4,  "rgba(255,255,255,0.8)");
    grad.addColorStop(1,    "rgba(255,255,255,0)");
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 64, 64);
    const starTexture = new THREE.CanvasTexture(starCanvas);

    // ── Particles ────────────────────────────────────────────────────────────
    const COUNT  = 10000;
    const SPREAD = 300;
    const DEPTH  = 1800;
    const pos    = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * SPREAD;
      pos[i * 3 + 1] = (Math.random() - 0.5) * SPREAD;
      pos[i * 3 + 2] = (Math.random() - 1) * DEPTH;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    const material = new THREE.PointsMaterial({
      size: 0.8,
      map: starTexture,
      color: 0xffffff,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false,
    });

    scene.add(new THREE.Points(geometry, material));
    camera.position.z = 5;

    // ── Speed state ──────────────────────────────────────────────────────────
    const BASE_SPEED = 2.5; // always flying forward (units/second)
    let speed = BASE_SPEED;
    let warpActive = false;
    let warpElapsed = 0;

    const handleWarp = () => {
      if (!document.documentElement.classList.contains("dark")) return;
      warpActive   = true;
      warpElapsed  = 0;
    };
    window.addEventListener("start-about-transition", handleWarp);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // ── Animation loop ────────────────────────────────────────────────────────
    let rafId: number;
    let last = 0;

    const animate = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // Warp: accelerate then coast back to base
      if (warpActive) {
        warpElapsed += dt;
        const WARP_DUR = 5.0;
        const t = Math.min(warpElapsed / WARP_DUR, 1.0);
        // bell curve: ramp up fast, hold, ramp down
        const boost = t < 0.4
          ? Math.pow(t / 0.4, 3) * 180
          : Math.pow(1 - (t - 0.4) / 0.6, 2) * 180;

        speed = BASE_SPEED + boost;
        camera.fov = 75 + Math.min(t / 0.4, 1) * 55;
        camera.updateProjectionMatrix();
        material.size = 0.8 + Math.min(t / 0.4, 1) * 3.0;

        if (warpElapsed >= WARP_DUR) {
          warpActive = false;
          camera.fov = 75;
          camera.updateProjectionMatrix();
          material.size = 0.8;
          speed = BASE_SPEED;
        }
      }

      // Move every star toward camera (+ z direction)
      const arr = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < COUNT; i++) {
        arr[i * 3 + 2] += speed * dt;

        // Recycle star behind the camera
        if (arr[i * 3 + 2] > camera.position.z + 15) {
          arr[i * 3]     = (Math.random() - 0.5) * SPREAD;
          arr[i * 3 + 1] = (Math.random() - 0.5) * SPREAD;
          arr[i * 3 + 2] = camera.position.z - DEPTH + Math.random() * 80;
        }
      }
      geometry.attributes.position.needsUpdate = true;

      // Gentle vertical drift with scroll
      camera.position.y += (-window.scrollY * 0.001 - camera.position.y) * 0.04;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("start-about-transition", handleWarp);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
      mountRef.current?.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      starTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "radial-gradient(ellipse at 50% 40%, #111130 0%, #08081a 50%, #020208 100%)" }}
    />
  );
}
