import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ArrowRight, Volume2, VolumeX, Crown } from 'lucide-react';
import { audioEngine } from '../utils/audio';

interface Props {
  onComplete: () => void;
}

export const HeyBroIntro: React.FC<Props> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [activeLetterIdx, setActiveLetterIdx] = useState<number>(-1);
  const [showTagline, setShowTagline] = useState<boolean>(false);
  const [showButton, setShowButton] = useState<boolean>(false);

  const wordOne = ['H', 'E', 'Y'];
  const wordTwo = ['B', 'R', 'O'];

  // Handle Sound Toggle
  const toggleSound = () => {
    const isUnmuted = audioEngine.toggleMute();
    setSoundEnabled(isUnmuted);
    if (isUnmuted) {
      audioEngine.playAtelierBassPulse();
    }
  };

  // Timeline progression
  useEffect(() => {
    setMounted(true);
    audioEngine.playAtelierBassPulse();

    // Play letter reveal chimes sequentially
    const timeouts: NodeJS.Timeout[] = [];
    
    [...wordOne, ...wordTwo].forEach((_, i) => {
      const t = setTimeout(() => {
        audioEngine.playLetterReveal(1 + i * 0.12);
      }, 300 + i * 150);
      timeouts.push(t);
    });

    const tTagline = setTimeout(() => {
      setShowTagline(true);
    }, 1400);
    timeouts.push(tTagline);

    const tButton = setTimeout(() => {
      setShowButton(true);
    }, 1900);
    timeouts.push(tButton);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  // Ambient Runway Canvas Dust & Light Beam simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse coordinates for dynamic spotlight
    let mouse = { x: width / 2, y: height / 2 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Luxury floating particles
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      maxAlpha: number;
      pulseSpeed: number;
    }

    const particles: Particle[] = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.3 - Math.random() * 0.5,
      radius: 0.8 + Math.random() * 2,
      alpha: 0.1 + Math.random() * 0.5,
      maxAlpha: 0.3 + Math.random() * 0.6,
      pulseSpeed: 0.02 + Math.random() * 0.03,
    }));

    let frame = 0;

    const render = () => {
      frame++;
      ctx.fillStyle = '#060606';
      ctx.fillRect(0, 0, width, height);

      // 1. Mouse Spotlight Beam
      const grad = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        Math.max(width, height) * 0.65
      );
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      grad.addColorStop(0.3, 'rgba(40, 40, 45, 0.05)');
      grad.addColorStop(1, 'rgba(6, 6, 6, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Horizontal Runway Horizon Glow
      const horizonGrad = ctx.createLinearGradient(0, height / 2 - 80, 0, height / 2 + 80);
      horizonGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      horizonGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.03)');
      horizonGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = horizonGrad;
      ctx.fillRect(0, height / 2 - 80, width, 160);

      // 3. Floating Platinum Dust
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        const pulse = Math.sin(frame * p.pulseSpeed) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * pulse * 0.75})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleEnter = () => {
    audioEngine.playEnterAtelier();
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#060606] text-white flex flex-col justify-between overflow-hidden select-none transition-all duration-700 ${
        mounted && !isExiting ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
      }`}
    >
      {/* Dynamic Runway Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto"
      />

      {/* Top Header Bar */}
      <div className="relative z-50 p-6 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white shadow-lg">
            <Crown className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-['Bebas_Neue'] text-lg tracking-widest text-white">
              HEY BRO
            </span>
            <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-zinc-400">
              Luxury Atelier
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-300 transition-all backdrop-blur-md cursor-pointer"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-white animate-pulse" />
                <span className="text-white">AUDIO ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
                <span>ENABLE AUDIO</span>
              </>
            )}
          </button>

          <button
            onClick={handleEnter}
            className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-zinc-700 hover:border-white text-xs font-mono uppercase tracking-wider transition-all backdrop-blur-md cursor-pointer"
          >
            Skip Intro →
          </button>
        </div>
      </div>

      {/* Center Hero Stage with HEY BRO Letter Animation */}
      <div className="relative z-40 my-auto flex flex-col items-center justify-center text-center px-4">
        {/* Subtle Luxury Badge */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-xs font-mono uppercase tracking-[0.3em] mb-8 shadow-2xl backdrop-blur-md animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>AUTUMN / WINTER 2026 RUNWAY</span>
        </div>

        {/* HEY BRO Animated Typography */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-12 md:gap-x-16 gap-y-2">
          {/* WORD 1: HEY */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
            {wordOne.map((char, index) => {
              const globalIdx = index;
              return (
                <div
                  key={index}
                  onMouseEnter={() => {
                    setActiveLetterIdx(globalIdx);
                    audioEngine.playLetterReveal(1.2 + globalIdx * 0.15);
                  }}
                  onMouseLeave={() => setActiveLetterIdx(-1)}
                  style={{
                    animationDelay: `${index * 140}ms`,
                    animationDuration: '800ms',
                    animationFillMode: 'both',
                  }}
                  className="relative group cursor-pointer animate-slide-up"
                >
                  {/* Subtle letter aura */}
                  <div className="absolute -inset-4 bg-white/5 rounded-3xl blur-2xl group-hover:bg-white/20 transition-all duration-300 pointer-events-none" />

                  {/* High Fashion Letterform */}
                  <span
                    style={{
                      textShadow:
                        activeLetterIdx === globalIdx
                          ? '0 0 50px rgba(255,255,255,0.7), 0 0 100px rgba(255,255,255,0.3)'
                          : '0 0 35px rgba(255,255,255,0.3), 0 20px 40px rgba(0,0,0,0.9)',
                    }}
                    className="font-['Bebas_Neue'] text-7xl sm:text-9xl md:text-[150px] lg:text-[180px] leading-none tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 block transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-3 select-none"
                  >
                    {char}
                  </span>

                  {/* Under-letter metallic accent line */}
                  <div
                    className={`h-[2px] bg-gradient-to-r from-transparent via-white to-transparent transition-all duration-300 ${
                      activeLetterIdx === globalIdx ? 'w-full opacity-100' : 'w-0 opacity-0'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* WORD 2: BRO */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
            {wordTwo.map((char, index) => {
              const globalIdx = index + 3;
              return (
                <div
                  key={index}
                  onMouseEnter={() => {
                    setActiveLetterIdx(globalIdx);
                    audioEngine.playLetterReveal(1.2 + globalIdx * 0.15);
                  }}
                  onMouseLeave={() => setActiveLetterIdx(-1)}
                  style={{
                    animationDelay: `${(index + 3) * 140}ms`,
                    animationDuration: '800ms',
                    animationFillMode: 'both',
                  }}
                  className="relative group cursor-pointer animate-slide-up"
                >
                  {/* Subtle letter aura */}
                  <div className="absolute -inset-4 bg-white/5 rounded-3xl blur-2xl group-hover:bg-white/20 transition-all duration-300 pointer-events-none" />

                  {/* High Fashion Letterform */}
                  <span
                    style={{
                      textShadow:
                        activeLetterIdx === globalIdx
                          ? '0 0 50px rgba(255,255,255,0.7), 0 0 100px rgba(255,255,255,0.3)'
                          : '0 0 35px rgba(255,255,255,0.3), 0 20px 40px rgba(0,0,0,0.9)',
                    }}
                    className="font-['Bebas_Neue'] text-7xl sm:text-9xl md:text-[150px] lg:text-[180px] leading-none tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 block transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-3 select-none"
                  >
                    {char}
                  </span>

                  {/* Under-letter metallic accent line */}
                  <div
                    className={`h-[2px] bg-gradient-to-r from-transparent via-white to-transparent transition-all duration-300 ${
                      activeLetterIdx === globalIdx ? 'w-full opacity-100' : 'w-0 opacity-0'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Narrative & Tagline Section */}
        {showTagline && (
          <div className="flex flex-col items-center mt-6 animate-fade-in">
            <div className="flex items-center gap-3 text-xs sm:text-sm font-mono text-zinc-400 uppercase font-semibold tracking-[0.35em]">
              <span className="h-[1px] w-6 sm:w-16 bg-zinc-700" />
              <span>THE MONOCHROMATIC COUTURE EXPERIENCE</span>
              <span className="h-[1px] w-6 sm:w-16 bg-zinc-700" />
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-md mx-auto mt-4 leading-relaxed">
              Crafted in deep obsidian silhouettes and high-twist European drape.
              Explore the 3D runway atelier and bespoke collections.
            </p>
          </div>
        )}

        {/* Enter Runway Button */}
        {showButton && (
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 pointer-events-auto animate-fade-in">
            <button
              onClick={handleEnter}
              className="group relative px-10 py-4 rounded-full bg-white text-black font-bold text-xs uppercase tracking-[0.25em] transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.6)] flex items-center gap-3 cursor-pointer"
            >
              <span>ENTER RUNWAY ATELIER</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />

              {/* Pulsing glow ring */}
              <span className="absolute -inset-1 rounded-full border border-white/50 animate-ping opacity-30 pointer-events-none" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Bar Details */}
      <div className="relative z-50 p-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-500 gap-3 border-t border-zinc-900 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>3D SPATIAL RUNWAY ACTIVE</span>
        </div>

        <div className="flex items-center gap-6">
          <span>MILAN • MUMBAI • TOKYO</span>
          <span>LIMITED EDITION SERIES</span>
        </div>
      </div>
    </div>
  );
};
