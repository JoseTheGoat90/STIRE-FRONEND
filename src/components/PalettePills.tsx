import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, ChevronDown, Sparkles, Check, Copy } from 'lucide-react';

export const PalettePills: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const colors = [
    {
      name: 'Azul Tecnológico',
      hex: '#0B3D91',
      role: 'Primario — MakeCode',
      bgClass: 'bg-[#0B3D91]',
      borderClass: 'border-[#0B3D91]',
    },
    {
      name: 'Morado Vibrante',
      hex: '#7B2FBF',
      role: 'Secundario — Sensores',
      bgClass: 'bg-[#7B2FBF]',
      borderClass: 'border-[#7B2FBF]',
    },
    {
      name: 'Turquesa Acción',
      hex: '#00C2A8',
      role: 'Acento — Acciones & CTA',
      bgClass: 'bg-[#00C2A8]',
      borderClass: 'border-[#00C2A8]',
    },
    {
      name: 'Gris Neutro',
      hex: '#F7F9FC',
      role: 'Texto & Contraste',
      bgClass: 'bg-[#F7F9FC] text-slate-900',
      borderClass: 'border-[#F7F9FC]',
    },
  ];

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="relative z-20 flex flex-col items-center">
      <button
        id="btn-toggle-palette"
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300/80 hover:border-[#00C2A8] backdrop-blur-md transition-all duration-200 shadow-sm cursor-pointer"
      >
        <div className="flex -space-x-1 items-center">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0B3D91] ring-1 ring-white" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#7B2FBF] ring-1 ring-white" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#00C2A8] ring-1 ring-white" />
        </div>
        <span className="text-[11px] font-medium tracking-wide">Paleta de la Guía Visual</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-full mt-2 w-80 p-3.5 rounded-2xl bg-white/98 border border-slate-200 shadow-2xl backdrop-blur-xl z-50 text-left"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs text-slate-600">
              <span className="font-semibold text-slate-900 flex items-center gap-1.5 font-['Poppins']">
                <Palette className="w-3.5 h-3.5 text-[#00C2A8]" />
                STIRE Soft: Identidad Visual
              </span>
              <span className="text-[10px] text-slate-400">Copiar Hex</span>
            </div>

            <div className="space-y-1.5">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => handleCopy(c.hex)}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-300 transition-all text-xs group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-5 h-5 rounded-lg ${c.bgClass} shadow-sm border border-black/10 flex-shrink-0`} />
                    <div className="text-left">
                      <div className="font-semibold text-slate-800 leading-none mb-1 text-[11px] font-['Poppins']">{c.name}</div>
                      <div className="text-[10px] text-slate-500 leading-none">{c.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[11px] text-slate-500 group-hover:text-slate-900">
                    <span>{c.hex}</span>
                    {copiedColor === c.hex ? (
                      <Check className="w-3.5 h-3.5 text-[#00C2A8]" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
              {['Minimalista', 'Tecnológico', 'Educativo', 'Juvenil', 'Amigable'].map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F7F9FC] text-slate-600 border border-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
