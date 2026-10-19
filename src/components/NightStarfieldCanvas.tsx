import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const NightStarfieldCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check reduced motion preference
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      2500
    );
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 2. Procedural Soft Star Disc Texture
    const createStarTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(255, 240, 200, 0.9)');
      gradient.addColorStop(0.5, 'rgba(240, 160, 210, 0.4)');
      gradient.addColorStop(1, 'rgba(20, 15, 45, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    // 3. Procedural Soft Storybook Cloud Puff Texture
    const createCloudTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Draw composite soft organic cloud puffs
      const puffs = [
        { x: 128, y: 70, r: 60, alpha: 0.35 },
        { x: 80, y: 80, r: 50, alpha: 0.3 },
        { x: 176, y: 75, r: 52, alpha: 0.3 },
        { x: 45, y: 90, r: 35, alpha: 0.2 },
        { x: 210, y: 88, r: 38, alpha: 0.22 },
      ];

      puffs.forEach((puff) => {
        const grad = ctx.createRadialGradient(puff.x, puff.y, 0, puff.x, puff.y, puff.r);
        grad.addColorStop(0, `rgba(200, 180, 230, ${puff.alpha})`);
        grad.addColorStop(0.5, `rgba(160, 110, 190, ${puff.alpha * 0.5})`);
        grad.addColorStop(1, 'rgba(30, 25, 60, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(puff.x, puff.y, puff.r, 0, Math.PI * 2);
        ctx.fill();
      });

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    const starTexture = createStarTexture();
    const cloudTexture = createCloudTexture();

    // 4. Procedural Starfield BufferGeometry
    const starCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    const palette = [
      new THREE.Color('#fbbf24'), // Warm amber
      new THREE.Color('#f59e0b'), // Starlight gold
      new THREE.Color('#f472b6'), // Pip soft pink
      new THREE.Color('#c084fc'), // Lavender dream
      new THREE.Color('#fff0e8'), // Soft warm ivory
    ];

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 1600;
      positions[i3 + 1] = (Math.random() - 0.5) * 1100;
      positions[i3 + 2] = (Math.random() - 0.5) * 1200 - 150; // Stars set further back

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 8 + 4;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 7,
      vertexColors: true,
      map: starTexture || undefined,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const starPoints = new THREE.Points(geometry, starMaterial);
    scene.add(starPoints);

    // 5. Subtle Semi-Transparent 3D Drifting Clouds
    interface CloudData {
      mesh: THREE.Mesh;
      baseSpeed: number;
      initialY: number;
      initialZ: number;
    }

    const cloudCount = 7;
    const clouds: CloudData[] = [];
    const cloudPlaneGeometry = new THREE.PlaneGeometry(650, 280);

    const cloudMaterial = new THREE.MeshBasicMaterial({
      map: cloudTexture || undefined,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    for (let i = 0; i < cloudCount; i++) {
      const mesh = new THREE.Mesh(cloudPlaneGeometry, cloudMaterial.clone());
      
      // Distribute clouds staggered across viewport and depth planes
      const initX = (i / cloudCount) * 2200 - 1100 + (Math.random() - 0.5) * 200;
      const initY = (Math.random() - 0.5) * 650;
      const initZ = (Math.random() - 0.5) * 350; // closer plane between stars and camera

      mesh.position.set(initX, initY, initZ);
      // Slight scale and opacity variance
      const scale = 0.85 + Math.random() * 0.6;
      mesh.scale.set(scale, scale, 1);
      (mesh.material as THREE.MeshBasicMaterial).opacity = 0.16 + Math.random() * 0.12;

      scene.add(mesh);
      clouds.push({
        mesh,
        baseSpeed: 10 + Math.random() * 12, // slow, gentle drift (units/sec)
        initialY: initY,
        initialZ: initZ,
      });
    }

    // 6. Cursor Tracking with Smooth Damping
    const mouse = {
      targetX: 0,
      targetY: 0,
      currentX: 0,
      currentY: 0,
    };

    const onPointerMove = (e: PointerEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // 7. Window Resize Handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onResize);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Smooth cursor interpolation
        mouse.currentX = THREE.MathUtils.damp(mouse.currentX, mouse.targetX, 3.5, delta);
        mouse.currentY = THREE.MathUtils.damp(mouse.currentY, mouse.targetY, 3.5, delta);

        // Camera tilt for 3D depth
        camera.position.x = mouse.currentX * 120;
        camera.position.y = mouse.currentY * 90;
        camera.lookAt(0, 0, 0);

        // Starfield gentle rotation
        starPoints.rotation.y = elapsedTime * 0.015 + mouse.currentX * 0.15;
        starPoints.rotation.x = elapsedTime * 0.008 + mouse.currentY * 0.1;

        // Animate clouds: slow horizontal drift + subtle vertical bobbing + cursor parallax
        clouds.forEach((cloud, index) => {
          // Horizontal drift
          cloud.mesh.position.x += cloud.baseSpeed * delta;
          // Wrap around seamlessly
          if (cloud.mesh.position.x > 1150) {
            cloud.mesh.position.x = -1150;
          }

          // Gentle vertical breathing wave
          const verticalWobble = Math.sin(elapsedTime * 0.4 + index) * 12;
          // Multi-layer parallax: nearer clouds shift more with cursor
          const depthFactor = (cloud.mesh.position.z + 400) / 400;
          cloud.mesh.position.y = cloud.initialY + verticalWobble + mouse.currentY * 20 * depthFactor;
        });
      } else {
        // Reduced motion: static camera, gentle star drift only
        starPoints.rotation.y = elapsedTime * 0.005;
        clouds.forEach((cloud) => {
          cloud.mesh.position.x += cloud.baseSpeed * 0.5 * delta;
          if (cloud.mesh.position.x > 1150) {
            cloud.mesh.position.x = -1150;
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Graceful Resource Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);

      geometry.dispose();
      starMaterial.dispose();
      cloudPlaneGeometry.dispose();
      cloudMaterial.dispose();
      clouds.forEach((c) => {
        (c.mesh.material as THREE.Material).dispose();
      });

      if (starTexture) starTexture.dispose();
      if (cloudTexture) cloudTexture.dispose();
      renderer.dispose();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-opacity duration-1000 animate-in fade-in"
    >
      {/* Background Soft Ambient Mist Ribbon for extra storybook depth */}
      <div className="absolute inset-0 pointer-events-none opacity-25 mix-blend-screen bg-gradient-to-t from-purple-950/40 via-transparent to-indigo-950/30" />
    </div>
  );
};
