import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Rocket,
  Brain,
  TrendingUp,
  Flame,
  CheckCircle2,
  ChevronRight,
  Play,
  CheckSquare,
  Zap,
  BookOpen,
  HelpCircle,
  LogOut,
  X,
  FileCode2,
  Award,
  Pin,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { UserSession } from '../types';
import { TutorChatbot } from './TutorChatbot';

interface StudentDashboardViewProps {
  session: UserSession;
  onSignOut: () => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({ session, onSignOut }) => {
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [activeUnit, setActiveUnit] = useState<'u1' | 'u2'>('u1');
  const [activeView, setActiveView] = useState<'curricular' | 'repasos' | 'progreso'>('curricular');

  // Exercise / Quiz Interactive Modal State
  const [exerciseModal, setExerciseModal] = useState<{
    isOpen: boolean;
    type: 'quiz' | 'exercise';
    title: string;
    unit: string;
  }>({
    isOpen: false,
    type: 'quiz',
    title: '',
    unit: '',
  });

  // Interactive Quiz State
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [domainProgress, setDomainProgress] = useState(0);

  const handleOpenExercise = (type: 'quiz' | 'exercise', title: string, unit: string) => {
    setExerciseModal({
      isOpen: true,
      type,
      title,
      unit,
    });
    setQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handleCompleteQuiz = () => {
    setQuizSubmitted(true);
    if (quizAnswer === 1) {
      setDomainProgress(25);
    }
  };

  return (
    <div className="w-full h-screen min-h-screen flex flex-col bg-[#F7F9FC] text-slate-800 font-sans selection:bg-[#00C2A8]/30 selection:text-[#0B3D91] overflow-hidden">
      {/* 1. TOP HEADER (Exact structure from panel estudiante.png with STIRE Soft Visual Guide) */}
      <header className="h-14 sm:h-16 px-4 sm:px-6 bg-white border-b border-slate-200/90 flex items-center justify-between flex-shrink-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        {/* Left: Brand + Role badge + Toggle Sidebar button */}
        <div className="flex items-center gap-3">
          {/* Button to toggle / collapse sidebar */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-[#0B3D91] hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
            title={sidebarOpen ? 'Ocultar barra lateral' : 'Desplegar barra lateral'}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="w-4 h-4 text-[#0B3D91]" />
            ) : (
              <PanelLeftOpen className="w-4 h-4 text-[#00C2A8]" />
            )}
          </button>

          {/* [ST] Brand Isotype Badge */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0B3D91] to-[#7B2FBF] p-[1.5px] shadow-sm flex-shrink-0">
            <div className="w-full h-full bg-[#0B3D91] rounded-[6.5px] flex items-center justify-center font-bold text-xs text-white font-['Poppins']">
              ST
            </div>
          </div>

          {/* Logo Typography */}
          <div className="flex items-baseline gap-1 font-['Poppins']">
            <span className="text-base font-bold tracking-tight text-[#0B3D91]">STIRE</span>
            <span className="text-base font-light text-slate-700">Soft</span>
          </div>

          {/* Role Pill: Rol: Estudiante */}
          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[#00C2A8]/12 text-[#008f7b] border border-[#00C2A8]/30 font-['Poppins'] hidden sm:inline-block">
            Rol: Estudiante
          </span>
        </div>

        {/* Center: Course & Teacher badge (from original student panel) */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200/90 text-xs text-slate-700 font-medium">
          <span className="font-semibold text-slate-800">Fundamentos de Algoritmia — Demo</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">Docente: Prof. Toscano</span>
        </div>

        {/* Right: Avatar + Salir */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Student Initial Avatar (ED / PR) */}
          <div
            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00C2A8] to-[#0B3D91] text-white flex items-center justify-center text-xs font-bold font-mono shadow-xs"
            title={`${session.name} (${session.institutionalId || 'Estudiante'})`}
          >
            {session.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </div>

          {/* Salir Button */}
          <button
            type="button"
            onClick={onSignOut}
            className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
            title="Cerrar sesión"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN BODY (Collapsible Sidebar + Content Canvas) */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        {/* COLLAPSIBLE SIDEBAR */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 250, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="h-full border-r border-slate-200/90 bg-white flex flex-col justify-between p-4 flex-shrink-0 overflow-y-auto select-none"
            >
              <div className="space-y-5">
                {/* TUTOR CHATBOT QUICK BUTTON (Added to Sidebar as requested) */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setIsChatbotOpen(true)}
                    className="w-full p-3 rounded-2xl bg-gradient-to-r from-[#0B3D91] to-[#7B2FBF] text-white text-xs font-bold transition-all shadow-md shadow-[#0B3D91]/15 hover:shadow-lg hover:shadow-[#00C2A8]/20 flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-white/15 flex items-center justify-center text-[#00C2A8]">
                        {/* Silhouette of a robot */}
                        <Bot className="w-4 h-4 text-[#00C2A8]" strokeWidth={2.4} />
                      </div>
                      <div className="text-left">
                        <div className="font-['Poppins'] font-bold leading-tight">Tutor IA Chatbot</div>
                        <div className="text-[10px] text-slate-200 font-normal">Consulta en vivo</div>
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-[#00C2A8] animate-pulse" />
                  </button>
                </div>

                {/* Units List */}
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 font-mono uppercase tracking-wider px-2 pb-1">
                    Unidades Curriculares
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveUnit('u1');
                      setActiveView('curricular');
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                      activeUnit === 'u1' && activeView === 'curricular'
                        ? 'bg-[#0B3D91]/10 text-[#0B3D91] font-bold border-l-3 border-[#00C2A8]'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#00C2A8]" />
                    <span className="truncate">Unidad 1: Variables y tipos d...</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveUnit('u2');
                      setActiveView('curricular');
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                      activeUnit === 'u2' && activeView === 'curricular'
                        ? 'bg-[#0B3D91]/10 text-[#0B3D91] font-bold border-l-3 border-[#00C2A8]'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                    <span className="truncate">Unidad 2: Estructuras de con...</span>
                  </button>
                </div>

                {/* CONSOLIDACIÓN Section */}
                <div className="space-y-1 pt-2">
                  <div className="text-[11px] font-bold text-slate-400 font-mono uppercase tracking-wider px-2 pb-1">
                    CONSOLIDACIÓN
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveView('repasos')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      activeView === 'repasos'
                        ? 'bg-[#7B2FBF]/10 text-[#7B2FBF] font-bold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-[#7B2FBF]" />
                      <span>Repasos</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-bold">
                      0
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveView('progreso')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                      activeView === 'progreso'
                        ? 'bg-[#00C2A8]/15 text-[#008f7b] font-bold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 text-[#00C2A8]" />
                    <span>Mi Progreso</span>
                  </button>
                </div>
              </div>

              {/* Bottom Card: 📌 Atajo Rápido (from original image) */}
              <div className="mt-4 p-3.5 rounded-2xl bg-[#F7F9FC] border border-slate-200 text-slate-700 space-y-1 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B3D91] font-['Poppins']">
                  <Pin className="w-3.5 h-3.5 text-[#00C2A8]" />
                  <span>Atajo Rápido</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Regla de los 3 clics: todo el contenido clave está a 1 clic de distancia.
                </p>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* MAIN SCROLLABLE DASHBOARD VIEW */}
        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* A. RECOMMENDATION CARD (Exact structure from panel estudiante.png with STIRE Soft Palette) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
            {/* Top colored accent line: Azul -> Morado -> Turquesa */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0B3D91] via-[#7B2FBF] to-[#00C2A8]" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left text & progress */}
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* RECOMENDACIÓN DEL TUTOR pill */}
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#7B2FBF]/12 text-[#7B2FBF] border border-[#7B2FBF]/30 font-['Poppins'] uppercase tracking-wider">
                    Recomendación del Tutor
                  </span>
                  {/* Sesión Activa pill */}
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#00C2A8] animate-ping" />
                    Sesión Activa
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold font-['Poppins'] text-[#0B3D91] tracking-tight">
                  Continúa con: Unidad 1: Variables y tipos de datos
                </h2>

                <p className="text-xs sm:text-sm text-slate-500 font-normal">
                  Declaración, asignación y tipos primitivos.
                </p>

                {/* Progress Bar with % de Dominio */}
                <div className="pt-2 max-w-md">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span>{domainProgress}% de Dominio</span>
                    <span className="text-[11px] text-[#00C2A8] font-mono">Umbral objetivo: 70%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#0B3D91] to-[#00C2A8] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${domainProgress}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 flex-shrink-0 sm:self-start lg:self-center">
                {/* 🚀 Continuar Ejercicio Button (Turquesa Acción) */}
                <button
                  type="button"
                  onClick={() =>
                    handleOpenExercise(
                      'exercise',
                      'Ejercicio: Suma de dos números',
                      'Unidad 1: Variables y tipos de datos'
                    )
                  }
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#00C2A8] hover:bg-[#12e2c8] text-[#070e24] shadow-md shadow-[#00C2A8]/20 transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-98 font-['Poppins']"
                >
                  <Rocket className="w-4 h-4 text-[#070e24]" />
                  <span>Continuar Ejercicio</span>
                </button>

                {/* 🧠 Repasar conceptos (0) Button (Morado Vibrante) */}
                <button
                  type="button"
                  onClick={() => setIsChatbotOpen(true)}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-slate-100 hover:bg-[#7B2FBF]/10 text-slate-700 hover:text-[#7B2FBF] border border-slate-200 hover:border-[#7B2FBF]/40 transition-all flex items-center justify-center gap-2 cursor-pointer font-['Poppins']"
                >
                  <Brain className="w-4 h-4 text-[#7B2FBF]" />
                  <span>Repasar conceptos ({domainProgress > 0 ? 1 : 0})</span>
                </button>
              </div>
            </div>
          </div>

          {/* B. 4 METRIC CARDS ROW (Exact metrics from original image) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Dominio Promedio */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm transition-all hover:shadow-md">
              <span className="text-xs text-slate-500 font-medium">Dominio Promedio</span>
              <div className="text-3xl font-black font-['Poppins'] text-[#0B3D91] mt-1">
                {domainProgress}%
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Supera umbral de 70%</p>
            </div>

            {/* Card 2: Tasa de Éxito en Envíos */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm transition-all hover:shadow-md">
              <span className="text-xs text-slate-500 font-medium">Tasa de Éxito en Envíos</span>
              <div className="text-3xl font-black font-['Poppins'] text-[#7B2FBF] mt-1">
                {domainProgress > 0 ? '100%' : '0%'}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Casos de prueba superados</p>
            </div>

            {/* Card 3: Racha de Aprendizaje */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm transition-all hover:shadow-md">
              <span className="text-xs text-slate-500 font-medium">Racha de Aprendizaje</span>
              <div className="text-3xl font-black font-['Poppins'] text-amber-500 flex items-center gap-1 mt-1">
                <Flame className="w-6 h-6 fill-amber-500 text-amber-500" />
                <span>{domainProgress > 0 ? '1 día' : '0 días'}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Constancia formativa</p>
            </div>

            {/* Card 4: Ejercicios Completados */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm transition-all hover:shadow-md">
              <span className="text-xs text-slate-500 font-medium">Ejercicios Completados</span>
              <div className="text-3xl font-black font-['Poppins'] text-[#008f7b] mt-1">
                {domainProgress > 0 ? '1' : '0'}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">En el período activo</p>
            </div>
          </div>

          {/* C. PLAN CURRICULAR DE LA ASIGNATURA */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🗺️</span>
                <h3 className="text-base font-bold font-['Poppins'] text-slate-800">
                  Plan Curricular de la Asignatura
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">1 Módulos disponibles</span>
            </div>

            {/* Module Container */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
              {/* Module Header */}
              <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 font-['Poppins']">
                  Módulo 1: Fundamentos
                </span>
                <span className="text-xs text-slate-400 font-mono">2 Unidades</span>
              </div>

              {/* Units List */}
              <div className="divide-y divide-slate-100">
                {/* UNIT 1 */}
                <div className="p-5 space-y-3 transition-colors hover:bg-slate-50/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-[#0B3D91]/10 text-[#0B3D91] border border-[#0B3D91]/25">
                          {domainProgress > 0 ? 'En Progreso' : 'Por Iniciar'}
                        </span>
                        <h4 className="text-sm font-bold text-slate-800 font-['Poppins']">
                          Unidad 1: Variables y tipos de datos{' '}
                          <span className="text-xs text-[#008f7b] font-mono">
                            ({domainProgress}% dominio)
                          </span>
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500">
                        Declaración, asignación y tipos primitivos.
                      </p>
                    </div>

                    {/* Practicar Button */}
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenExercise(
                          'quiz',
                          'Quiz: ¿Qué es una variable?',
                          'Unidad 1: Variables y tipos de datos'
                        )
                      }
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0B3D91] hover:bg-[#0e48a8] text-white transition-all flex items-center justify-center gap-1.5 flex-shrink-0 cursor-pointer shadow-sm hover:shadow-md hover:shadow-[#0B3D91]/20 self-start sm:self-center font-['Poppins']"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Practicar</span>
                    </button>
                  </div>

                  {/* Actividades Ponderadas */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap text-xs text-slate-500">
                    <span className="text-[11px] font-semibold text-slate-400">
                      Actividades ponderadas:
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleOpenExercise(
                          'quiz',
                          'Quiz: ¿Qué es una variable?',
                          'Unidad 1: Variables y tipos de datos'
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#7B2FBF] hover:bg-[#7B2FBF]/5 text-[11px] text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <span>📝</span>
                      <span className="font-medium">Quiz: ¿Qué es una variable? (100%)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleOpenExercise(
                          'exercise',
                          'Ejercicio: Suma de dos números',
                          'Unidad 1: Variables y tipos de datos'
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#00C2A8] hover:bg-[#00C2A8]/5 text-[11px] text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <span>⚡</span>
                      <span className="font-medium">Ejercicio: Suma de dos números (100%)</span>
                    </button>
                  </div>
                </div>

                {/* UNIT 2 */}
                <div className="p-5 space-y-3 transition-colors hover:bg-slate-50/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                          Por Iniciar
                        </span>
                        <h4 className="text-sm font-bold text-slate-800 font-['Poppins']">
                          Unidad 2: Estructuras de control{' '}
                          <span className="text-xs text-slate-400 font-mono">(0% dominio)</span>
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500">
                        Condicionales if/else y su lógica de decisión.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleOpenExercise(
                          'exercise',
                          'Completa el condicional',
                          'Unidad 2: Estructuras de control'
                        )
                      }
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0B3D91] hover:bg-[#0e48a8] text-white transition-all flex items-center justify-center gap-1.5 flex-shrink-0 cursor-pointer shadow-sm self-start sm:self-center font-['Poppins']"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Practicar</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 pt-1 flex-wrap text-xs text-slate-500">
                    <span className="text-[11px] font-semibold text-slate-400">
                      Actividades ponderadas:
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenExercise(
                          'exercise',
                          'Completa el condicional',
                          'Unidad 2: Estructuras de control'
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#00C2A8] text-[11px] text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <span>⚡</span>
                      <span className="font-medium">Completa el condicional (100%)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 3. COMFORTABLE CHATBOT COMPONENT (WITH ROBOT SILHOUETTE ICON) */}
      <TutorChatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        studentName={session.name}
        activeUnitTitle="Unidad 1: Variables y tipos de datos"
      />

      {/* Floating trigger button in bottom-right if chatbot is closed */}
      {!isChatbotOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-gradient-to-r from-[#0B3D91] via-[#7B2FBF] to-[#00C2A8] text-white shadow-xl shadow-[#0B3D91]/25 hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2.5 cursor-pointer group"
          title="Abrir Tutor IA Chatbot"
        >
          {/* Silhouette of a robot */}
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-[#00C2A8]">
            <Bot className="w-5 h-5 text-white" strokeWidth={2.4} />
          </div>
          <span className="text-xs font-bold font-['Poppins'] pr-1 hidden sm:inline">
            Tutor IA
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#00C2A8] animate-ping" />
        </motion.button>
      )}

      {/* 4. INTERACTIVE PRACTICE / QUIZ MODAL */}
      <AnimatePresence>
        {exerciseModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden font-sans"
            >
              {/* Modal Header */}
              <div className="bg-[#0B3D91] px-5 py-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#00C2A8]">
                    {exerciseModal.type === 'quiz' ? <HelpCircle className="w-5 h-5" /> : <FileCode2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-['Poppins']">{exerciseModal.title}</h3>
                    <p className="text-[11px] text-slate-300">{exerciseModal.unit}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setExerciseModal({ ...exerciseModal, isOpen: false })}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                {exerciseModal.type === 'quiz' ? (
                  <div className="space-y-4">
                    <p className="text-xs sm:text-sm font-semibold text-slate-800">
                      Pregunta diagnóstica: En algoritmos, ¿cuál es la función primordial de una <b>variable</b>?
                    </p>

                    <div className="space-y-2">
                      {[
                        'Detener la ejecución del procesador en caso de ciclo infinito.',
                        'Reservar un espacio en memoria RAM para almacenar un dato mutable.',
                        'Imprimir de manera obligatoria texto en la consola de comandos.',
                        'Transformar código binario directamente en interfaz gráfica.',
                      ].map((option, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => !quizSubmitted && setQuizAnswer(idx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-start gap-2.5 ${
                            quizAnswer === idx
                              ? 'border-[#00C2A8] bg-[#00C2A8]/10 text-[#0B3D91] font-semibold'
                              : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                          } ${
                            quizSubmitted && idx === 1
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                              : ''
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${
                              quizAnswer === idx
                                ? 'bg-[#00C2A8] text-[#070e24]'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </button>
                      ))}
                    </div>

                    {quizSubmitted && (
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">¡Respuesta Correcta!</p>
                          <p className="text-[11px] text-emerald-700 mt-0.5">
                            Tu dominio en la Unidad 1 ha aumentado a 25%. El Tutor IA ha registrado tu progreso formativo.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-600">
                      Escribe la instrucción básica para declarar dos variables enteras `a` y `b`, y calcular su suma:
                    </p>
                    <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs space-y-1">
                      <div><span className="text-purple-400">int</span> a = <span className="text-amber-300">5</span>;</div>
                      <div><span className="text-purple-400">int</span> b = <span className="text-amber-300">10</span>;</div>
                      <div><span className="text-purple-400">int</span> suma = a + b;</div>
                      <div className="text-slate-500">// Resultado en memoria: 15</div>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Caso de prueba validado con el motor de evaluación STIRE.
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setExerciseModal({ ...exerciseModal, isOpen: false });
                    setIsChatbotOpen(true);
                  }}
                  className="text-xs font-semibold text-[#7B2FBF] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Consultar con Tutor IA</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setExerciseModal({ ...exerciseModal, isOpen: false })}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
                  >
                    {quizSubmitted ? 'Cerrar' : 'Cancelar'}
                  </button>

                  {!quizSubmitted && exerciseModal.type === 'quiz' ? (
                    <button
                      type="button"
                      disabled={quizAnswer === null}
                      onClick={handleCompleteQuiz}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00C2A8] hover:bg-[#12e2c8] text-[#070e24] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                    >
                      Enviar Respuesta
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setDomainProgress(40);
                        setExerciseModal({ ...exerciseModal, isOpen: false });
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00C2A8] hover:bg-[#12e2c8] text-[#070e24] transition-all cursor-pointer shadow-sm"
                    >
                      Guardar y Continuar
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
