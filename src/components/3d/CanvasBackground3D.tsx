import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, Sparkles, Layers, Sliders } from 'lucide-react';

interface Props {
  themeMode?: 'studio' | 'gold' | 'cyber' | 'minimal';
  interactiveParallax?: boolean;
}

export const CanvasBackground3D: React.FC<Props> = ({
  themeMode = 'studio',
  interactiveParallax = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTheme, setActiveTheme] = useState<'studio' | 'gold' | 'cyber' | 'minimal'>(themeMode);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [particleSpeed, setParticleSpeed] = useState<number>(1);
  const [spotlightIntensity, setSpotlightIntensity] = useState<number>(1.5);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080808, 0.035);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 18;
    camera.position.y = 1;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Group for all animated 3D objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Lighting (Monochrome Black & White / Platinum Studio Lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const mainSpotlight = new THREE.SpotLight(0xffffff, spotlightIntensity * 4.5);
    mainSpotlight.position.set(0, 15, 10);
    mainSpotlight.angle = Math.PI / 4;
    mainSpotlight.penumbra = 0.8;
    mainSpotlight.decay = 2;
    mainSpotlight.distance = 50;
    scene.add(mainSpotlight);

    const leftSpot = new THREE.PointLight(0xe4e4e7, 2.5, 30);
    leftSpot.position.set(-12, 6, 4);
    scene.add(leftSpot);

    const rightSpot = new THREE.PointLight(0xffffff, 2.8, 30);
    rightSpot.position.set(12, 6, 4);
    scene.add(rightSpot);

    // 2. Floating 3D Geometric Luxury Rings & Toruses
    const geometryGroup = new THREE.Group();
    mainGroup.add(geometryGroup);

    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.98,
      roughness: 0.1,
      wireframe: false,
    });

    const platinumMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4f4f5,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0x27272a,
      emissiveIntensity: 0.15,
    });

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x71717a,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    // Large floating luxury ring
    const torusGeo = new THREE.TorusGeometry(6, 0.15, 16, 100);
    const torusMesh = new THREE.Mesh(torusGeo, platinumMaterial);
    torusMesh.position.set(0, 0, -2);
    torusMesh.rotation.x = Math.PI / 3;
    geometryGroup.add(torusMesh);

    // Secondary concentric ring
    const torusGeo2 = new THREE.TorusGeometry(8.5, 0.08, 16, 100);
    const torusMesh2 = new THREE.Mesh(torusGeo2, chromeMaterial);
    torusMesh2.position.set(0, 0, -4);
    torusMesh2.rotation.y = Math.PI / 4;
    geometryGroup.add(torusMesh2);

    // Floating fashion octahedrons & prisms
    const floatingObjects: { mesh: THREE.Mesh; rotSpeedX: number; rotSpeedY: number; floatOffset: number; initialY: number }[] = [];

    for (let i = 0; i < 18; i++) {
      const isPlatinum = i % 3 === 0;
      const isWire = i % 4 === 0;
      const mat = isPlatinum ? platinumMaterial : isWire ? wireframeMaterial : chromeMaterial;
      const geom = i % 2 === 0
        ? new THREE.IcosahedronGeometry(Math.random() * 0.8 + 0.4, 0)
        : new THREE.OctahedronGeometry(Math.random() * 0.9 + 0.5, 0);

      const mesh = new THREE.Mesh(geom, mat);
      const angle = (i / 18) * Math.PI * 2;
      const radius = Math.random() * 8 + 7;
      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * 12;
      const z = Math.sin(angle) * (radius * 0.5) - Math.random() * 6;

      mesh.position.set(x, y, z);
      geometryGroup.add(mesh);

      floatingObjects.push({
        mesh,
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        floatOffset: Math.random() * Math.PI * 2,
        initialY: y,
      });
    }

    // 3. Floating 3D Starfield / Diamond Silver Particles
    const particleCount = 700;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0xffffff); // Pure Diamond White
    const color2 = new THREE.Color(0xd4d4d8); // Platinum Silver
    const color3 = new THREE.Color(0x71717a); // Cool Slate Obsidian

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;

      scales[i] = Math.random() * 3 + 1;

      const chosenColor = Math.random() > 0.5 ? color1 : Math.random() > 0.5 ? color2 : color3;
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.3, 'rgba(255,255,255,0.8)');
      gradient.addColorStop(0.7, 'rgba(212,212,216,0.3)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.35,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
      opacity: 0.85,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particleSystem);

    // 4. Ground Grid for 3D Perspective Depth
    const gridHelper = new THREE.GridHelper(60, 40, 0x71717a, 0x18181b);
    gridHelper.position.y = -8;
    gridHelper.material.opacity = 0.25;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Mouse Parallax
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactiveParallax) return;
      targetX = (e.clientX / window.innerWidth - 0.5) * 3;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Scroll depth effect
    let scrollOffset = 0;
    const handleScroll = () => {
      scrollOffset = window.scrollY * 0.003;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Animation Loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime() * particleSpeed;

      // Smooth mouse interpolation
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      camera.position.x = currentX;
      camera.position.y = -currentY + 1 - scrollOffset * 1.5;
      camera.lookAt(0, -scrollOffset * 1.5, 0);

      // Rotate central toruses
      torusMesh.rotation.z = elapsedTime * 0.15;
      torusMesh.rotation.x = Math.PI / 3 + Math.sin(elapsedTime * 0.3) * 0.1;

      torusMesh2.rotation.z = -elapsedTime * 0.1;
      torusMesh2.rotation.y = Math.PI / 4 + Math.cos(elapsedTime * 0.2) * 0.1;

      // Rotate and bob floating geometries
      floatingObjects.forEach((item) => {
        item.mesh.rotation.x += item.rotSpeedX;
        item.mesh.rotation.y += item.rotSpeedY;
        item.mesh.position.y = item.initialY + Math.sin(elapsedTime + item.floatOffset) * 0.8;
      });

      // Slowly rotate particle field
      particleSystem.rotation.y = elapsedTime * 0.02;
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.03) * 0.05;

      // Move spotlights dynamically
      mainSpotlight.position.x = Math.sin(elapsedTime * 0.5) * 6;
      mainSpotlight.position.z = 10 + Math.cos(elapsedTime * 0.4) * 4;

      leftSpot.intensity = 2 + Math.sin(elapsedTime * 2) * 0.5;
      rightSpot.intensity = 2 + Math.cos(elapsedTime * 2) * 0.5;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      torusGeo.dispose();
      torusGeo2.dispose();
    };
  }, [interactiveParallax, particleSpeed, spotlightIntensity, activeTheme]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Cinematic Vignette & Ambient Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-black/70 pointer-events-none" />

      {/* Floating 3D HUD Controls on Top-Right */}
      <div className="absolute top-20 right-6 pointer-events-auto z-20 flex flex-col items-end gap-2">
        <button
          id="toggle-3d-hud"
          onClick={() => setShowControls(!showControls)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs text-white/80 hover:text-white hover:border-white/50 transition-all shadow-lg"
          title="3D Background Lighting & Shader Controls"
        >
          <Sliders className="w-3.5 h-3.5 text-white" />
          <span className="font-mono uppercase tracking-wider text-[10px]">3D Studio FX</span>
        </button>

        {showControls && (
          <div className="w-64 p-4 rounded-2xl bg-neutral-950/95 backdrop-blur-xl border border-white/20 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-white" /> Live 3D Shaders
              </span>
              <span className="text-[10px] font-mono text-white/40">WebGL 60FPS</span>
            </div>

            {/* Atmosphere Presets */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-medium text-white/50 uppercase tracking-wider block mb-1.5">
                  Lighting Atmosphere
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['studio', 'gold', 'cyber', 'minimal'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveTheme(t)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium capitalize border transition-all text-left ${
                        activeTheme === t
                          ? 'bg-white text-black border-white font-bold'
                          : 'bg-black/60 border-white/10 text-white/60 hover:text-white hover:border-white/30'
                      }`}
                    >
                      {t === 'studio' && '🎬 Runway Studio'}
                      {t === 'gold' && '💎 Platinum Chrome'}
                      {t === 'cyber' && '⚡ High Contrast'}
                      {t === 'minimal' && '🌑 Pitch Dark'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Particle Speed */}
              <div>
                <div className="flex justify-between text-[10px] text-white/60 mb-1">
                  <span>Particle Velocity</span>
                  <span className="font-mono text-white">{particleSpeed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.1"
                  value={particleSpeed}
                  onChange={(e) => setParticleSpeed(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>

              {/* Spotlight Intensity */}
              <div>
                <div className="flex justify-between text-[10px] text-white/60 mb-1">
                  <span>Spotlight Lumens</span>
                  <span className="font-mono text-white">{spotlightIntensity.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={spotlightIntensity}
                  onChange={(e) => setSpotlightIntensity(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
