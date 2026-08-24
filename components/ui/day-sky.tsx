"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function makeGlowTexture(rays: number, rayLen: number, rayWidth: number): THREE.CanvasTexture {
  const size = 512;
  const c = document.createElement("canvas");
  c.width = size; c.height = size;
  const ctx = c.getContext("2d")!;
  const half = size / 2;

  // Core radial glow
  const grd = ctx.createRadialGradient(half, half, 0, half, half, half);
  grd.addColorStop(0,    "rgba(255,255,220,1)");
  grd.addColorStop(0.08, "rgba(255,220,60,0.9)");
  grd.addColorStop(0.3,  "rgba(255,140,20,0.4)");
  grd.addColorStop(0.7,  "rgba(255,80,0,0.08)");
  grd.addColorStop(1,    "rgba(255,60,0,0)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, size, size);

  // Flare spikes
  ctx.save();
  ctx.translate(half, half);
  for (let i = 0; i < rays; i++) {
    ctx.rotate((Math.PI * 2) / rays);
    const len = rayLen * (0.55 + Math.random() * 0.45);
    const w   = rayWidth * (0.3 + Math.random() * 0.7);
    ctx.beginPath();
    ctx.moveTo(0, 12);
    ctx.lineTo( w, len);
    ctx.lineTo(-w, len);
    const spike = ctx.createLinearGradient(0, 12, 0, len);
    spike.addColorStop(0, "rgba(255,230,80,0.6)");
    spike.addColorStop(1, "rgba(255,100,0,0)");
    ctx.fillStyle = spike;
    ctx.fill();
  }
  ctx.restore();

  return new THREE.CanvasTexture(c);
}

export function DaySky() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // ── Renderer ─────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0); // fully transparent clear
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    mountRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.z = 5;

    // ── Sun sphere ────────────────────────────────────────────────────────────
    const sunGeo = new THREE.SphereGeometry(18, 64, 64);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffee44 });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sun.position.set(0, 0, -80);
    scene.add(sun);

    // ── Corona layers (added to scene, NOT children of sun) ───────────────────
    const makeSpriteLayer = (rays: number, rayLen: number, rayWidth: number, worldSize: number) => {
      const tex = makeGlowTexture(rays, rayLen, rayWidth);
      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 1,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(worldSize, worldSize, 1);
      scene.add(sprite);
      return { sprite, mat, tex };
    };

    const L1 = makeSpriteLayer(22, 150, 9,  55);  // tight bright inner halo
    const L2 = makeSpriteLayer(14, 200, 16, 95);  // mid corona
    const L3 = makeSpriteLayer(8,  240, 26, 160); // soft outer halo

    // ── Dust particles ────────────────────────────────────────────────────────
    const DUST = 400;
    const dpos = new Float32Array(DUST * 3);
    for (let i = 0; i < DUST; i++) {
      dpos[i * 3]     = (Math.random() - 0.5) * 200;
      dpos[i * 3 + 1] = (Math.random() - 0.5) * 200;
      dpos[i * 3 + 2] = -Math.random() * 120 - 10;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dpos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xffeebb, size: 0.3, transparent: true, opacity: 0.3,
      blending: THREE.AdditiveBlending, sizeAttenuation: true,
    });
    scene.add(new THREE.Points(dustGeo, dustMat));

    // ── Sun corner placement ──────────────────────────────────────────────────
    let warpActive = false;
    let baseX = 0, baseY = 0;

    const placeSun = () => {
      const dist = camera.position.z - sun.position.z;
      const vFov = (camera.fov * Math.PI) / 180;
      const visH = 2 * Math.tan(vFov / 2) * dist;
      const visW = visH * camera.aspect;
      baseX = -visW * 0.38;   // left quadrant
      baseY =  visH * 0.30;   // upper quadrant
      if (!warpActive) sun.position.set(baseX, baseY, sun.position.z);
    };

    placeSun();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (!warpActive) placeSun();
    };
    window.addEventListener("resize", handleResize);

    // ── Warp ─────────────────────────────────────────────────────────────────
    let warpElapsed = 0;
    let warpStartX = 0, warpStartY = 0, warpStartZ = sun.position.z;

    const handleWarp = () => {
      if (document.documentElement.classList.contains("dark")) return;
      warpActive   = true;
      warpElapsed  = 0;
      warpStartX   = sun.position.x;
      warpStartY   = sun.position.y;
      warpStartZ   = sun.position.z;
    };
    window.addEventListener("start-about-transition", handleWarp);

    // ── Animation ─────────────────────────────────────────────────────────────
    let rafId: number;
    let last = 0;
    let rot1 = 0, rot2 = 0, rot3 = 0;

    const animate = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;

      if (warpActive) {
        warpElapsed += dt;
        const WARP = 4.5;
        const p  = Math.min(warpElapsed / WARP, 1);
        const ep = Math.pow(p, 2);

        sun.position.x = THREE.MathUtils.lerp(warpStartX, 0, Math.pow(p, 0.35));
        sun.position.y = THREE.MathUtils.lerp(warpStartY, 0, Math.pow(p, 0.35));
        sun.position.z = THREE.MathUtils.lerp(warpStartZ, camera.position.z - 6, ep);
        sun.scale.setScalar(1 + ep * 20);
        camera.fov = THREE.MathUtils.lerp(45, 115, Math.pow(p, 1.4));
        camera.updateProjectionMatrix();

        rot1 += (0.5 + ep * 30) * dt;
        rot2 -= (0.3 + ep * 20) * dt;
        rot3 += (0.2 + ep * 14) * dt;

        if (warpElapsed >= WARP) {
          warpActive = false;
          camera.fov = 45;
          camera.updateProjectionMatrix();
          sun.scale.setScalar(1);
          placeSun();
        }

      } else {
        // Parallax with scroll — very subtle
        camera.position.y += (-window.scrollY * 0.004 - camera.position.y) * 0.04;

        // Multi-frequency pulsing corona — organic breathing
        const p1 = 1 + Math.sin(t * 1.10)       * 0.12
                     + Math.sin(t * 2.80 + 0.6) * 0.05;
        const p2 = 1 + Math.sin(t * 0.70 + 1.1) * 0.16
                     + Math.sin(t * 3.20 + 1.3) * 0.06;
        const p3 = 1 + Math.sin(t * 0.45 + 2.2) * 0.22
                     + Math.sin(t * 1.75 + 0.9) * 0.09;

        L1.sprite.scale.set(55 * p1, 55 * p1, 1);
        L2.sprite.scale.set(95 * p2, 95 * p2, 1);
        L3.sprite.scale.set(160 * p3, 160 * p3, 1);

        // Slow counter-rotation
        rot1 += 0.20 * dt;
        rot2 -= 0.10 * dt;
        rot3 += 0.06 * dt;

        // Core brightness oscillation
        const bri = 0.93 + Math.sin(t * 1.6) * 0.07;
        sunMat.color.setRGB(bri, bri * 0.93, bri * 0.27);

        // Organic wander (SET not +=)
        sun.position.x = baseX + Math.sin(t * 0.21) * 1.8;
        sun.position.y = baseY + Math.cos(t * 0.16) * 1.0;
      }

      L1.mat.rotation = rot1;
      L2.mat.rotation = rot2;
      L3.mat.rotation = rot3;

      // Keep sprites aligned with sun
      L1.sprite.position.copy(sun.position);
      L2.sprite.position.copy(sun.position);
      L3.sprite.position.copy(sun.position);

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("start-about-transition", handleWarp);
      mountRef.current?.removeChild(renderer.domElement);
      sunGeo.dispose(); sunMat.dispose();
      L1.tex.dispose(); L1.mat.dispose();
      L2.tex.dispose(); L2.mat.dispose();
      L3.tex.dispose(); L3.mat.dispose();
      dustGeo.dispose(); dustMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: "linear-gradient(to bottom, #87ceeb 0%, #b8dff5 55%, #d6f0ff 100%)",
        position: "fixed",
        inset: 0,
      }}
    />
  );
}
