import React, { useState, useRef } from 'react';
import { Product } from '../../types';
import { RotateCw, ZoomIn, Sun, Sparkles, Layers, ShieldCheck } from 'lucide-react';

interface Props {
  product: Product;
  selectedColorHex: string;
}

export const ProductViewer360: React.FC<Props> = ({ product, selectedColorHex }) => {
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [lightAngle, setLightAngle] = useState<number>(45);
  const [activeTexture, setActiveTexture] = useState<string>('weave');

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startX;
    setRotationAngle((prev) => (prev + delta * 0.8) % 360);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Determine image slice based on rotation angle (simulated multi-angle 3D spin)
  const imageIndex = Math.floor((((rotationAngle % 360) + 360) % 360) / (360 / Math.max(1, product.images.length))) % product.images.length;
  const currentImage = product.images[imageIndex] || product.images[0];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-neutral-900 to-black border border-white/10 p-4 select-none">
      {/* 360 Viewer Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5">
            <RotateCw className="w-3 h-3 animate-spin-slow text-white" /> 360° Virtual Showcase
          </span>
          <span className="text-[11px] text-zinc-400">Drag left/right to spin</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoomLevel((prev) => (prev === 1 ? 1.5 : 1))}
            className={`p-1.5 rounded-lg border transition-all ${
              zoomLevel > 1
                ? 'bg-white text-black border-white'
                : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white'
            }`}
            title="Inspect Fabric Texture Zoom"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D Stage Area */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative h-72 md:h-96 w-full flex items-center justify-center rounded-2xl overflow-hidden cursor-ew-resize bg-radial from-neutral-800/40 via-neutral-950 to-black"
      >
        {/* Dynamic Studio Light Beam Angle */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-300"
          style={{
            background: `linear-gradient(${lightAngle}deg, rgba(255, 255, 255, 0.12) 0%, transparent 60%)`,
          }}
        />

        {/* 3D Model Display with dynamic color overlay and perspective */}
        <div
          className="relative transition-transform duration-100 ease-out"
          style={{
            transform: `scale(${zoomLevel}) rotateY(${(rotationAngle % 20) - 10}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          <img
            src={currentImage}
            alt={product.name}
            className="max-h-64 md:max-h-80 object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-all duration-300"
          />

          {/* Color Tint Multiplier */}
          {selectedColorHex && selectedColorHex !== '#ffffff' && (
            <div
              className="absolute inset-0 mix-blend-color opacity-30 pointer-events-none rounded-xl"
              style={{ backgroundColor: selectedColorHex }}
            />
          )}

          {/* Procedural Fabric Micro-Texture Overlay when zoomed in */}
          {zoomLevel > 1 && (
            <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:6px_6px]" />
          )}
        </div>

        {/* Dynamic 360 Indicator Ring */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[11px] text-white">
          <RotateCw className="w-3 h-3 text-white" />
          <span className="font-mono">{Math.round(rotationAngle % 360)}° View</span>
        </div>
      </div>

      {/* Fabric Specs & Live Light Tuning Bar */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="w-3.5 h-3.5 text-white" />
            <span className="text-[11px] text-zinc-300">Studio Light Angle</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={lightAngle}
            onChange={(e) => setLightAngle(parseInt(e.target.value))}
            className="w-20 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>

        <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            <span className="text-[11px] text-zinc-300">Fabric Structure</span>
          </div>
          <span className="text-[11px] font-semibold text-white font-mono">
            {product.fabric.split(' ')[0]}
          </span>
        </div>
      </div>
    </div>
  );
};
