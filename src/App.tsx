import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TechBackground } from './components/TechBackground';
import { LoginForm } from './components/LoginForm';
import { WelcomeDashboard } from './components/WelcomeDashboard';
import { PalettePills } from './components/PalettePills';
import { UserSession } from './types';
import { Sun, Moon } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [cardTheme, setCardTheme] = useState<'light' | 'dark'>('light');

  // Full-screen software mode when entering any role panel (Estudiante, Docente, Admin)
  if (session) {
    return (
      <div className="fixed inset-0 w-screen h-screen min-h-screen bg-[#F7F9FC] text-slate-800 font-sans selection:bg-[#00C2A8]/30 selection:text-[#0B3D91] overflow-hidden z-50">
        <WelcomeDashboard
          session={session}
          onSignOut={() => setSession(null)}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden bg-[#F7F9FC] text-slate-800 font-sans selection:bg-[#00C2A8]/30 selection:text-[#0B3D91]">
      {/* Background layer with Gris Neutro #F7F9FC */}
      <TechBackground />

      {/* Top Header Bar strictly matching Image 1: [ST] STIRE Soft | Universidad de Córdoba • Sistema Tutor Inteligente */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-8 pt-6 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Brand logo with [ST] badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B3D91] to-[#7B2FBF] p-[2px] shadow-md shadow-[#0B3D91]/20">
            <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center border border-white/20">
              <span className="text-sm font-black tracking-tighter text-[#0B3D91] font-['Poppins']">
                ST
              </span>
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold tracking-tight text-[#0B3D91] font-['Poppins']">
              STIRE
            </span>
            <span className="text-xl font-light text-slate-700 font-['Poppins']">
              Soft
            </span>
          </div>
        </div>

        {/* Right: Institutional subtitle matching Image 1 + Controls */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4 text-center sm:text-right">
          <div className="text-xs text-slate-600 font-medium">
            <span className="text-slate-800 font-semibold">Universidad de Córdoba</span>
            <span className="mx-2 text-[#00C2A8] font-bold">•</span>
            <span className="text-[#0B3D91] font-medium">Sistema Tutor Inteligente</span>
          </div>

          {/* Card theme toggle */}
          <button
            type="button"
            onClick={() => setCardTheme(cardTheme === 'light' ? 'dark' : 'light')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold bg-white border border-slate-300/80 hover:border-[#00C2A8] text-slate-700 shadow-sm transition-all cursor-pointer"
            title="Cambiar aspecto de la tarjeta de inicio"
          >
            {cardTheme === 'light' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-[#7B2FBF]" />
                <span>Tarjeta Oscura</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Tarjeta Clara</span>
              </>
            )}
          </button>

          <PalettePills />
        </div>
      </header>

      {/* Main Content: Login Form */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key="login-screen"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <LoginForm
                cardTheme={cardTheme}
                onSuccess={(newSession) => setSession(newSession)}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer matching exact text from Image 1 */}
      <footer className="relative z-20 w-full max-w-6xl mx-auto px-4 py-5 border-t border-slate-200/90 text-center text-xs text-slate-500">
        <p>
          © 2026 STIRE-Soft. Todos los derechos reservados. Cumple estándar WCAG 2.1 AA.
        </p>
      </footer>
    </div>
  );
}
