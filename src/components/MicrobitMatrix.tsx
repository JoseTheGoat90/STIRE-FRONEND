import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MatrixPreset, LEDMatrixPattern } from '../types';

interface MicrobitMatrixProps {
  currentEmotion?: MatrixPreset;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onPatternChange?: (preset: MatrixPreset) => void;
}

export const MATRIX_PRESETS: LEDMatrixPattern[] = [
  {
    id: 'smile',
    name: 'Sonrisa Maker',
    grid: [
      [0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
    ],
  },
  {
    id: 'heart',
    name: 'Corazón Tech',
    grid: [
      [0, 1, 0, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
    ],
  },
  {
    id: 'code',
    name: 'Código < / >',
    grid: [
      [0, 1, 0, 1, 0],
      [1, 0, 0, 0, 1],
      [0, 0, 1, 0, 0],
      [1, 0, 0, 0, 1],
      [0, 1, 0, 1, 0],
    ],
  },
  {
    id: 'robot',
    name: 'Bot Maker',
    grid: [
      [1, 1, 1, 1, 1],
      [1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1],
    ],
  },
  {
    id: 'lock',
    name: 'Seguro',
    grid: [
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1],
      [1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1],
    ],
  },
  {
    id: 'sparkle',
    name: 'Chispa Creativa',
    grid: [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 0, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
    ],
  },
];

export const MicrobitMatrix: React.FC<MicrobitMatrixProps> = ({
  currentEmotion,
  interactive = true,
  size = 'md',
  onPatternChange,
}) => {
  const [presetIndex, setPresetIndex] = useState(0);
  const [customGrid, setCustomGrid] = useState<number[][] | null>(null);

  // Synchronize emotion override if provided
  useEffect(() => {
    if (currentEmotion) {
      const idx = MATRIX_PRESETS.findIndex((p) => p.id === currentEmotion);
      if (idx !== -1) {
        setPresetIndex(idx);
        setCustomGrid(null);
      }
    }
  }, [currentEmotion]);

  const activePattern = customGrid
    ? customGrid
    : MATRIX_PRESETS[presetIndex].grid;

  const handleNextPreset = () => {
    setCustomGrid(null);
    const next = (presetIndex + 1) % MATRIX_PRESETS.length;
    setPresetIndex(next);
    onPatternChange?.(MATRIX_PRESETS[next].id);
  };

  const handlePrevPreset = () => {
    setCustomGrid(null);
    const prev = (presetIndex - 1 + MATRIX_PRESETS.length) % MATRIX_PRESETS.length;
    setPresetIndex(prev);
    onPatternChange?.(MATRIX_PRESETS[prev].id);
  };

  const toggleLed = (r: number, c: number) => {
    if (!interactive) return;
    const base = customGrid
      ? customGrid.map((row) => [...row])
      : MATRIX_PRESETS[presetIndex].grid.map((row) => [...row]);
    base[r][c] = base[r][c] ? 0 : 1;
    setCustomGrid(base);
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5 gap-1',
    md: 'w-2.5 h-2.5 gap-1.5',
    lg: 'w-3.5 h-3.5 gap-2',
  };

  return (
    <div
      id="microbit-matrix-container"
      className="inline-flex items-center gap-3 px-3 py-2 rounded-2xl bg-[#0b132b]/80 border border-[#00C2A8]/20 backdrop-blur-md shadow-lg shadow-[#00C2A8]/5 select-none"
    >
      {/* Button A */}
      {interactive && (
        <button
          id="btn-matrix-prev"
          type="button"
          onClick={handlePrevPreset}
          className="w-6 h-6 rounded-full border border-slate-700 bg-[#0d1b3e] text-[10px] font-bold text-slate-300 hover:text-[#00C2A8] hover:border-[#00C2A8]/50 active:scale-95 transition-all flex items-center justify-center font-mono shadow-sm"
          title="Botón A: Patrón anterior"
        >
          A
        </button>
      )}

      {/* 5x5 LED Grid */}
      <div
        id="led-grid-5x5"
        className={`grid grid-cols-5 ${dotSizes[size]}`}
      >
        {activePattern.map((row, rIdx) =>
          row.map((val, cIdx) => {
            const isLit = val === 1;
            // Alternating teal & purple glow like in the image's top-right matrix
            const isTeal = (rIdx + cIdx) % 2 === 0;
            return (
              <motion.button
                key={`${rIdx}-${cIdx}`}
                type="button"
                onClick={() => toggleLed(rIdx, cIdx)}
                disabled={!interactive}
                whileHover={interactive ? { scale: 1.2 } : undefined}
                whileTap={interactive ? { scale: 0.9 } : undefined}
                className={`rounded-full transition-colors duration-200 ${
                  size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'
                } ${
                  isLit
                    ? isTeal
                      ? 'bg-[#00C2A8] shadow-[0_0_8px_#00C2A8]'
                      : 'bg-[#7B2FBF] shadow-[0_0_8px_#7B2FBF]'
                    : 'bg-[#152347] hover:bg-[#1f3261]'
                }`}
                aria-label={`LED (${rIdx},${cIdx})`}
              />
            );
          })
        )}
      </div>

      {/* Button B */}
      {interactive && (
        <button
          id="btn-matrix-next"
          type="button"
          onClick={handleNextPreset}
          className="w-6 h-6 rounded-full border border-slate-700 bg-[#0d1b3e] text-[10px] font-bold text-slate-300 hover:text-[#7B2FBF] hover:border-[#7B2FBF]/50 active:scale-95 transition-all flex items-center justify-center font-mono shadow-sm"
          title="Botón B: Siguiente patrón"
        >
          B
        </button>
      )}
    </div>
  );
};
