import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  FolderOpen,
  PenTool,
  BarChart3,
  Mail,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Plus,
  Copy,
  Check,
  CheckCircle2,
  Share2,
  QrCode,
  BookOpen,
  TrendingUp,
  Settings,
  Search,
  Filter,
  MoreVertical,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Clock,
  Sparkles,
  Layers,
  Award,
  FileText,
  UserCheck,
  Send,
  X,
  ArrowRight,
  Eye,
  Sliders,
  HelpCircle,
} from 'lucide-react';
import { UserSession } from '../types';

interface TeacherDashboardViewProps {
  session: UserSession;
  onSignOut: () => void;
}

interface ClassItem {
  id: string;
  code: string;
  name: string;
  description: string;
  enrolledStudents: number;
  status: 'Activo' | 'Habilitada' | 'En Pausa';
  enrollmentMode: 'Directa' | 'Con Aprobación';
  semester: string;
  averageMastery: number;
  lastActivity: string;
}

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({ session, onSignOut }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'clases' | 'contenidos' | 'crear' | 'rendimiento' | 'mensajes'>('clases');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedClassForRoster, setSelectedClassForRoster] = useState<ClassItem | null>(null);
  const [selectedClassForAnalytics, setSelectedClassForAnalytics] = useState<ClassItem | null>(null);
  const [showQrModal, setShowQrModal] = useState<string | null>(null);

  // New class form state
  const [newClassName, setNewClassName] = useState('');
  const [newClassDescription, setNewClassDescription] = useState('');
  const [newClassEnrollment, setNewClassEnrollment] = useState<'Directa' | 'Con Aprobación'>('Directa');

  // Teacher classes data
  const [classes, setClasses] = useState<ClassItem[]>([
    {
      id: '1',
      code: 'DEMO-STIRE-01',
      name: 'Fundamentos de Algoritmia — Demo',
      description: 'Clase de demostración generada por db:seed:demo.',
      enrolledStudents: 38,
      status: 'Activo',
      enrollmentMode: 'Directa',
      semester: '2026-1',
      averageMastery: 74,
      lastActivity: 'Hoy, hace 15 min',
    },
    {
      id: '2',
      code: 'ALG-2026-G02',
      name: 'Algoritmos y Programación I — Grupo 02',
      description: 'Asignatura troncal. Estructuras de control, modularidad y depuración guiada por IA.',
      enrolledStudents: 34,
      status: 'Activo',
      enrollmentMode: 'Directa',
      semester: '2026-1',
      averageMastery: 68,
      lastActivity: 'Ayer',
    },
  ]);

  // Students list for roster modal
  const sampleStudents = [
    { id: '1', name: 'Pedro Romero', code: 'EST-2024-0042', mastery: 68, streak: 4, quizzes: '3/4', status: 'En progreso', risk: 'Normal' },
    { id: '2', name: 'Sofía Morales', code: 'EST-2024-0019', mastery: 92, streak: 8, quizzes: '4/4', status: 'Avanzado', risk: 'Bajo' },
    { id: '3', name: 'Andrés Castro', code: 'EST-2024-0077', mastery: 45, streak: 1, quizzes: '1/4', status: 'En rezago', risk: 'Alto' },
    { id: '4', name: 'Valentina Peña', code: 'EST-2024-0081', mastery: 80, streak: 5, quizzes: '4/4', status: 'Avanzado', risk: 'Bajo' },
    { id: '5', name: 'Mateo Gómez', code: 'EST-2024-0104', mastery: 62, streak: 3, quizzes: '2/4', status: 'En progreso', risk: 'Normal' },
    { id: '6', name: 'Camila Rivas', code: 'EST-2024-0055', mastery: 51, streak: 2, quizzes: '2/4', status: 'En riesgo', risk: 'Medio' },
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const generatedCode = `STIRE-${Math.floor(1000 + Math.random() * 9000)}`;
    const newClass: ClassItem = {
      id: Date.now().toString(),
      code: generatedCode,
      name: newClassName.trim(),
      description: newClassDescription.trim() || 'Grupo creado para el periodo académico 2026-1.',
      enrolledStudents: 0,
      status: 'Activo',
      enrollmentMode: newClassEnrollment,
      semester: '2026-1',
      averageMastery: 0,
      lastActivity: 'Recién creada',
    };

    setClasses((prev) => [newClass, ...prev]);
    setNewClassName('');
    setNewClassDescription('');
    setIsCreateModalOpen(false);
  };

  const filteredClasses = classes.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-screen min-h-screen flex flex-col bg-[#F7F9FC] text-slate-800 font-sans selection:bg-[#00C2A8]/30 selection:text-[#0B3D91] overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER (Paleta oficial: Azul Tecnológico, Morado, Turquesa)         */}
      {/* ========================================================================= */}
      <header className="h-14 sm:h-16 px-4 sm:px-6 bg-white border-b border-slate-200/90 flex items-center justify-between flex-shrink-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        {/* Left: Toggle Sidebar + Brand + Role Badge */}
        <div className="flex items-center gap-3">
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

          {/* Role Pill: Rol: Docente (exact from Pnel docente.png) */}
          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[#7B2FBF]/12 text-[#7B2FBF] border border-[#7B2FBF]/30 font-['Poppins'] hidden sm:inline-block">
            Rol: Docente
          </span>
        </div>

        {/* Center: Institutional context */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200/90 text-xs text-slate-700 font-medium">
          <span className="font-semibold text-slate-800">Universidad de Córdoba</span>
          <span className="text-slate-300">•</span>
          <span className="text-[#0B3D91] font-semibold">Facultad de Ingeniería de Sistemas</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">Semestre 2026-1</span>
        </div>

        {/* Right: Teacher Avatar + Salir button (exact from Pnel docente.png) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Avatar (DD or PT) */}
          <div
            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7B2FBF] to-[#0B3D91] text-white flex items-center justify-center text-xs font-bold font-mono shadow-xs"
            title={`${session.name} (Docente Titular)`}
          >
            {session.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase() || 'DD'}
          </div>

          {/* Salir Button */}
          <button
            type="button"
            onClick={onSignOut}
            className="text-xs font-semibold text-slate-600 hover:text-red-600 transition-colors flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
            title="Cerrar sesión"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="font-medium">Salir</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. BODY LAYOUT: SIDEBAR (GESTIÓN DOCENTE) + MAIN CONTENT                   */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        <aside
          className={`flex flex-col justify-between border-r border-slate-200 bg-white transition-all duration-300 flex-shrink-0 z-20 ${
            sidebarOpen ? 'w-64 sm:w-72' : 'w-0 -translate-x-full overflow-hidden border-none'
          }`}
        >
          {/* Nav Items Section */}
          <div className="p-4 space-y-6 overflow-y-auto">
            {/* Header: GESTIÓN DOCENTE (exact uppercase label from image) */}
            <div>
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase font-['Poppins']">
                GESTIÓN DOCENTE
              </span>

              {/* Navigation items from Pnel docente.png */}
              <nav className="mt-3 space-y-1.5">
                {/* 1. Mis Clases (DOC-V01) */}
                <button
                  type="button"
                  onClick={() => setActiveTab('clases')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'clases'
                      ? 'bg-[#0B3D91] text-white shadow-sm shadow-[#0B3D91]/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className={`w-4 h-4 ${activeTab === 'clases' ? 'text-[#00C2A8]' : 'text-slate-500'}`} />
                    <span>Mis Clases (DOC-V01)</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                      activeTab === 'clases'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {classes.length}
                  </span>
                </button>

                {/* 2. Contenidos (DOC-V02) */}
                <button
                  type="button"
                  onClick={() => setActiveTab('contenidos')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'contenidos'
                      ? 'bg-[#0B3D91] text-white shadow-sm shadow-[#0B3D91]/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FolderOpen className={`w-4 h-4 ${activeTab === 'contenidos' ? 'text-[#00C2A8]' : 'text-slate-500'}`} />
                    <span>Contenidos (DOC-V02)</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">4 Mód.</span>
                </button>

                {/* 3. Crear Ejercicio (DOC-V03) */}
                <button
                  type="button"
                  onClick={() => setActiveTab('crear')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'crear'
                      ? 'bg-[#0B3D91] text-white shadow-sm shadow-[#0B3D91]/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <PenTool className={`w-4 h-4 ${activeTab === 'crear' ? 'text-[#00C2A8]' : 'text-slate-500'}`} />
                    <span>Crear Ejercicio (DOC-V03)</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#7B2FBF]/10 text-[#7B2FBF] font-bold">
                    + Nuevo
                  </span>
                </button>

                {/* 4. Rendimiento (DOC-V04) */}
                <button
                  type="button"
                  onClick={() => setActiveTab('rendimiento')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'rendimiento'
                      ? 'bg-[#0B3D91] text-white shadow-sm shadow-[#0B3D91]/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className={`w-4 h-4 ${activeTab === 'rendimiento' ? 'text-[#00C2A8]' : 'text-slate-500'}`} />
                    <span>Rendimiento (DOC-V04)</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 font-semibold">74%</span>
                </button>

                {/* 5. Mensajes (DOC-V06) */}
                <button
                  type="button"
                  onClick={() => setActiveTab('mensajes')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'mensajes'
                      ? 'bg-[#0B3D91] text-white shadow-sm shadow-[#0B3D91]/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Mail className={`w-4 h-4 ${activeTab === 'mensajes' ? 'text-[#00C2A8]' : 'text-slate-500'}`} />
                    <span>Mensajes (DOC-V06)</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#7B2FBF]" />
                </button>
              </nav>
            </div>
          </div>

          {/* Bottom Card: Atajo Rápido (exact from Pnel docente.png with STIRE palette) */}
          <div className="p-4 border-t border-slate-200">
            <div className="p-3.5 rounded-xl bg-[#F7F9FC] border border-slate-200 text-xs space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-1.5 text-slate-800 font-bold font-['Poppins']">
                <span>📌</span>
                <span className="text-[#0B3D91]">Atajo Rápido</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Regla de los 3 clics: todo el contenido clave está a 1 clic de distancia.
              </p>
            </div>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* MAIN CONTENT AREA                                                         */}
        {/* ========================================================================= */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* TAB 1: MIS CLASES (DOC-V01) */}
          {activeTab === 'clases' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              {/* Top Banner & Title Box matching image with modern official styling */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  {/* Breadcrumb Tag: PANEL DOCENTE • DOC-V01 */}
                  <span className="inline-block text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-md bg-[#0B3D91]/10 text-[#0B3D91] border border-[#0B3D91]/20">
                    PANEL DOCENTE • DOC-V01
                  </span>

                  {/* Main Title */}
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Poppins'] tracking-tight">
                    Mis Clases y Grupos Asignados
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm text-slate-500">
                    Universidad de Córdoba • Sistema de Tutoría Inteligente STIRE
                  </p>
                </div>

                {/* Primary Action Button: + Crear Nueva Clase (improved from muddy brown to official Azul Tecnológico) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#0B3D91] hover:bg-[#082a66] text-white font-bold text-xs font-['Poppins'] shadow-sm shadow-[#0B3D91]/25 hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
                  >
                    <Plus className="w-4 h-4 text-[#00C2A8]" strokeWidth={2.5} />
                    <span>Crear Nueva Clase</span>
                  </button>
                </div>
              </div>

              {/* Quick Metrics Bar (improves teacher comfort and immediate overview) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-400 font-medium">Total Estudiantes</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-slate-900 font-['Poppins']">72</span>
                    <span className="text-[11px] text-emerald-600 font-bold">Activos</span>
                  </div>
                  <span className="text-[11px] text-slate-400">En 2 grupos habilitados</span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-400 font-medium">Dominio Promedio</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-[#0B3D91] font-['Poppins']">74%</span>
                    <span className="text-[11px] text-emerald-600 font-bold">↑ +6%</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Algoritmos y Programación</span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-400 font-medium">Tutor IA Interacciones</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-[#7B2FBF] font-['Poppins']">92%</span>
                    <span className="text-[11px] text-[#7B2FBF] font-bold">Alta adopción</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Dudas resueltas automáticamente</span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-400 font-medium">Alumnos en Rezago</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-amber-500 font-['Poppins']">3</span>
                    <span className="text-[11px] text-amber-600 font-bold">Refuerzo listo</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Actividades preparatorias enviadas</span>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar clase por código o nombre..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:border-[#00C2A8] focus:ring-1 focus:ring-[#00C2A8] outline-none transition-all shadow-2xs"
                  />
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Mostrando {filteredClasses.length} clases</span>
                </div>
              </div>

              {/* CLASSES LIST (Exact card structure from Pnel docente.png with vastly improved button distribution) */}
              <div className="space-y-4">
                {filteredClasses.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-5"
                  >
                    {/* Card Top Row: Code badge + Copiar código link + Activo status */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* DEMO-STIRE-01 Badge (clean neutral styling) */}
                        <span className="px-2.5 py-1 rounded-md bg-[#F7F9FC] border border-slate-300/80 font-mono text-xs font-bold text-slate-700 tracking-wider">
                          {item.code}
                        </span>

                        {/* Copiar código button with interactive feedback */}
                        <button
                          type="button"
                          onClick={() => handleCopyCode(item.code)}
                          className="text-xs font-semibold text-[#0B3D91] hover:text-[#7B2FBF] transition-colors flex items-center gap-1 underline underline-offset-2 cursor-pointer"
                        >
                          {copiedCode === item.code ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#00C2A8]" />
                              <span className="text-[#00C2A8] font-bold">¡Código copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar código</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Status badge: Activo (styled with official green/turquoise) */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {item.status}
                        </span>
                      </div>
                    </div>

                    {/* Class Title & Description */}
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-['Poppins']">
                        {item.name}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        {item.description}
                      </p>
                    </div>

                    {/* Data Row from screenshot: Código de Ingreso, Estado, Matrícula */}
                    <div className="p-4 rounded-xl bg-[#F7F9FC] border border-slate-200/90 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <span className="text-[11px] text-slate-400 font-medium block">Código de Ingreso</span>
                        <span className="text-xs font-bold font-mono text-slate-800 tracking-wide mt-0.5 block">
                          {item.code}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-400 font-medium block">Estado</span>
                        <span className="text-xs font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          Habilitada
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-400 font-medium block">Matrícula</span>
                        <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                          {item.enrollmentMode} ({item.enrolledStudents} alumnos)
                        </span>
                      </div>
                    </div>

                    {/* IMPROVED BUTTON DISTRIBUTION SECTION */}
                    {/* Here we transform the cramped two-button footer into a spacious, comfortable, ergonomic control hub */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Quick Share Pill */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium">
                          Comparte el código con tus alumnos:
                        </span>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
                          <span className="font-mono text-xs font-bold text-slate-800">{item.code}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(item.code)}
                            className="p-1 text-slate-500 hover:text-[#0B3D91] transition-colors cursor-pointer"
                            title="Copiar código"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowQrModal(item.code)}
                            className="p-1 text-slate-500 hover:text-[#7B2FBF] transition-colors cursor-pointer"
                            title="Ver código QR para proyección"
                          >
                            <QrCode className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Right: Comfortable, ergonomic action buttons */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        {/* 1. Matrícula Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedClassForRoster(item)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-[#0B3D91] text-[#0B3D91] hover:text-white border border-[#0B3D91]/25 hover:border-[#0B3D91] transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>Matrícula</span>
                          <span className="px-1.5 py-0.2 rounded-md bg-[#0B3D91]/10 group-hover:bg-white/20 text-[10px]">
                            {item.enrolledStudents}
                          </span>
                        </button>

                        {/* 2. Rendimiento Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedClassForAnalytics(item)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#7B2FBF]/10 hover:bg-[#7B2FBF] text-[#7B2FBF] hover:text-white border border-[#7B2FBF]/25 hover:border-[#7B2FBF] transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
                        >
                          <BarChart3 className="w-3.5 h-3.5" />
                          <span>Rendimiento</span>
                          <span className="text-[10px] font-mono text-emerald-600 font-black">74%</span>
                        </button>

                        {/* 3. Contenidos Shortcut */}
                        <button
                          type="button"
                          onClick={() => setActiveTab('contenidos')}
                          className="px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                          <span>Contenidos</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CONTENIDOS (DOC-V02) */}
          {activeTab === 'contenidos' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="inline-block text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-md bg-[#0B3D91]/10 text-[#0B3D91] border border-[#0B3D91]/20">
                    CONTENIDOS • DOC-V02
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Poppins'] mt-1">
                    Estructura Curricular y Unidades de Aprendizaje
                  </h2>
                  <p className="text-xs text-slate-500">
                    Módulos activos supervisados por el Sistema Tutor Inteligente
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('crear')}
                  className="px-4 py-2.5 rounded-xl bg-[#0B3D91] hover:bg-[#082a66] text-white font-bold text-xs font-['Poppins'] transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#00C2A8]" />
                  <span>Añadir Unidad o Quiz</span>
                </button>
              </div>

              {/* Modules list */}
              <div className="space-y-4">
                {/* Module 1 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                    <div>
                      <span className="text-xs font-bold text-[#0B3D91] font-['Poppins']">
                        MÓDULO 1: Fundamentos y Tipado de Datos
                      </span>
                      <p className="text-xs text-slate-500">Sintaxis elemental, memoria y estructuras secuenciales</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                      En Curso (42% Dominio Promedio)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#F7F9FC] border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800">Unidad 1: Variables y Tipos de Datos</span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">Quiz ponderado: ¿Qué es una variable? (39% promedio)</span>
                      </div>
                      <span className="text-xs font-bold text-[#00C2A8]">68% Dominio</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#F7F9FC] border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800">Unidad 2: Condicionales y Lógica Booleana</span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">Ejercicios if / else / switch anidados</span>
                      </div>
                      <span className="text-xs font-bold text-[#7B2FBF]">32% Dominio</span>
                    </div>
                  </div>
                </div>

                {/* Module 2 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 opacity-90">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-700 font-['Poppins']">
                        MÓDULO 2: Estructuras Cíclicas y Algoritmos Repetitivos
                      </span>
                      <p className="text-xs text-slate-400">Bucles for, while, do-while e invariantes</p>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">Programado para Semana 5</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CREAR EJERCICIO (DOC-V03) */}
          {activeTab === 'crear' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-1">
                <span className="inline-block text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-md bg-[#7B2FBF]/10 text-[#7B2FBF] border border-[#7B2FBF]/20">
                  CREAR EJERCICIO • DOC-V03
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Poppins']">
                  Diseño de Actividades y Quizzes Ponderados
                </h2>
                <p className="text-xs text-slate-500">
                  Genera preguntas diagnósticas adaptables al nivel del estudiante con asistencia del tutor pedagógico.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase font-['Poppins'] mb-1.5">
                    Título del Ejercicio o Pregunta
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Evaluación de Ámbito y Asignación de Variables"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#00C2A8] focus:ring-1 focus:ring-[#00C2A8] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase font-['Poppins'] mb-1.5">
                      Módulo Asociado
                    </label>
                    <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 outline-none">
                      <option>Módulo 1: Fundamentos y Tipado</option>
                      <option>Módulo 2: Estructuras Cíclicas</option>
                      <option>Módulo 3: Funciones y Modularidad</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase font-['Poppins'] mb-1.5">
                      Nivel de Dificultad
                    </label>
                    <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 outline-none">
                      <option>Básico (Introducción)</option>
                      <option>Intermedio (Razonamiento)</option>
                      <option>Avanzado (Depuración de Errores)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase font-['Poppins'] mb-1.5">
                    Enunciado del Problema
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe el reto que el estudiante debe resolver en la plataforma..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#00C2A8] outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveTab('clases')}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      alert('¡Ejercicio guardado y publicado en el banco de actividades!');
                      setActiveTab('clases');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#0B3D91] hover:bg-[#082a66] text-white font-bold text-xs font-['Poppins'] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Check className="w-4 h-4 text-[#00C2A8]" />
                    <span>Guardar y Publicar</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RENDIMIENTO (DOC-V04) */}
          {activeTab === 'rendimiento' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-1">
                <span className="inline-block text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  RENDIMIENTO • DOC-V04
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Poppins']">
                  Analítica Global de Aprendizaje de los Grupos
                </h2>
                <p className="text-xs text-slate-500">
                  Métricas de asimilación conceptual y alertas de intervención temprana
                </p>
              </div>

              {/* Detailed Performance Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 font-['Poppins']">
                    Distribución de Alumnos por Nivel
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-emerald-700">Avanzado (&gt;80%)</span>
                        <span className="text-slate-600">22 alumnos (58%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '58%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-[#0B3D91]">Intermedio (60% - 79%)</span>
                        <span className="text-slate-600">13 alumnos (34%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-[#0B3D91] h-full rounded-full" style={{ width: '34%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-amber-600">Rezago (&lt;60%)</span>
                        <span className="text-slate-600">3 alumnos (8%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '8%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold text-slate-800 font-['Poppins']">
                    Recomendaciones Pedagógicas del Tutor IA
                  </h3>
                  <div className="space-y-2.5">
                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1">
                      <div className="flex items-center gap-2 font-bold text-amber-900">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>Confusión Detectada: Operador de asignación `=` vs comparación `==`</span>
                      </div>
                      <p className="text-amber-800 text-[11px] leading-relaxed">
                        El 41% de los estudiantes del Grupo 1 falló la pregunta 2 del Quiz 1. Se sugiere realizar una breve demostración práctica en la próxima clase sincrónica.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#00C2A8]/10 border border-[#00C2A8]/30 text-xs space-y-1">
                      <div className="flex items-center gap-2 font-bold text-[#0B3D91]">
                        <CheckCircle2 className="w-4 h-4 text-[#00C2A8]" />
                        <span>Excelente asimilación en declaración de tipos enteros y flotantes</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        El 94% resolvió con éxito las actividades de tipado estático en la primera semana.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MENSAJES (DOC-V06) */}
          {activeTab === 'mensajes' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-1">
                <span className="inline-block text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-md bg-[#7B2FBF]/10 text-[#7B2FBF] border border-[#7B2FBF]/20">
                  MENSAJES • DOC-V06
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Poppins']">
                  Bandeja de Consultas Académicas
                </h2>
                <p className="text-xs text-slate-500">
                  Preguntas enviadas por los estudiantes canalizadas a través del tutor
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs divide-y divide-slate-100">
                <div className="py-3.5 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Pedro Romero (EST-2024-0042)</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#00C2A8]/15 text-[#008f7b] font-bold">
                        Consulta Quiz 1
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Profesor, revisé la explicación del tutor sobre las variables estáticas pero tengo una duda con el ámbito global. ¿Lo vemos en clase?
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">Hace 2 horas</span>
                </div>

                <div className="py-3.5 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Sofía Morales (EST-2024-0019)</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                        Ejercicio Extra
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Terminé el módulo de condicionales con 92% de aciertos. ¿Hay algún ejercicio adicional de estructuras repetitivas habilitado?
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">Ayer</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: CREAR NUEVA CLASE                                                  */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0B3D91]/10 flex items-center justify-center text-[#0B3D91]">
                    <Plus className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-['Poppins']">
                    Crear Nueva Clase o Grupo
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateClass} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 font-['Poppins'] mb-1">
                    Nombre de la Asignatura / Grupo *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="Ej: Algoritmos y Programación II — Grupo 03"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#00C2A8] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 font-['Poppins'] mb-1">
                    Descripción Breve
                  </label>
                  <textarea
                    rows={2}
                    value={newClassDescription}
                    onChange={(e) => setNewClassDescription(e.target.value)}
                    placeholder="Objetivos o notas para los estudiantes matriculados..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#00C2A8] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 font-['Poppins'] mb-1">
                    Modalidad de Matrícula
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setNewClassEnrollment('Directa')}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                        newClassEnrollment === 'Directa'
                          ? 'bg-[#0B3D91]/10 border-[#0B3D91] text-[#0B3D91]'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="font-bold block">Directa</span>
                      <span className="text-[10px] text-slate-500 font-normal">Los alumnos ingresan con el código</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewClassEnrollment('Con Aprobación')}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                        newClassEnrollment === 'Con Aprobación'
                          ? 'bg-[#0B3D91]/10 border-[#0B3D91] text-[#0B3D91]'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="font-bold block">Con Aprobación</span>
                      <span className="text-[10px] text-slate-500 font-normal">El docente autoriza cada solicitud</span>
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#0B3D91] hover:bg-[#082a66] text-white text-xs font-bold font-['Poppins'] flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4 text-[#00C2A8]" />
                    <span>Crear y Habilitar Clase</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: MATRÍCULA DE ESTUDIANTES                                            */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedClassForRoster && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-[#0B3D91]/10 text-[#0B3D91] font-mono font-bold">
                      {selectedClassForRoster.code}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 font-['Poppins']">
                      Matrícula: {selectedClassForRoster.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedClassForRoster.enrolledStudents} alumnos inscritos • Semestre 2026-1
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedClassForRoster(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Students table */}
              <div className="p-5 overflow-y-auto flex-1 space-y-3">
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2.5 grid grid-cols-12 text-[11px] font-bold text-slate-500 font-['Poppins'] uppercase">
                    <span className="col-span-5">Estudiante</span>
                    <span className="col-span-3 text-center">Dominio</span>
                    <span className="col-span-2 text-center">Racha</span>
                    <span className="col-span-2 text-right">Estado</span>
                  </div>

                  {sampleStudents.map((st) => (
                    <div key={st.id} className="px-4 py-3 grid grid-cols-12 items-center text-xs hover:bg-slate-50/80 transition-colors">
                      <div className="col-span-5">
                        <span className="font-semibold text-slate-800 block">{st.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">{st.code}</span>
                      </div>

                      <div className="col-span-3 text-center">
                        <span className="font-bold text-slate-800">{st.mastery}%</span>
                        <div className="w-16 mx-auto bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              st.mastery >= 75 ? 'bg-emerald-500' : st.mastery >= 60 ? 'bg-[#0B3D91]' : 'bg-amber-500'
                            }`}
                            style={{ width: `${st.mastery}%` }}
                          />
                        </div>
                      </div>

                      <div className="col-span-2 text-center font-mono font-bold text-amber-600">
                        🔥 {st.streak}d
                      </div>

                      <div className="col-span-2 text-right">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            st.risk === 'Bajo'
                              ? 'bg-emerald-50 text-emerald-700'
                              : st.risk === 'Medio'
                              ? 'bg-[#0B3D91]/10 text-[#0B3D91]'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {st.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                <span className="text-slate-500">Listado sincronizado con la base de datos institucional.</span>
                <button
                  type="button"
                  onClick={() => setSelectedClassForRoster(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 text-white font-semibold cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: QR PROYECCIÓN                                                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-xl p-6 text-center space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#0B3D91] font-['Poppins']">Código de Inscripción Rápida</span>
                <button
                  type="button"
                  onClick={() => setShowQrModal(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="w-48 h-48 mx-auto bg-slate-50 border-2 border-dashed border-[#0B3D91]/30 rounded-2xl flex flex-col items-center justify-center p-4">
                <QrCode className="w-28 h-28 text-[#0B3D91]" />
                <span className="font-mono text-sm font-black text-slate-900 mt-2">{showQrModal}</span>
              </div>

              <p className="text-xs text-slate-500">
                Proyecta este código en el aula. Los alumnos pueden escribirlo directamente en su panel de inicio.
              </p>

              <button
                type="button"
                onClick={() => {
                  handleCopyCode(showQrModal);
                  setShowQrModal(null);
                }}
                className="w-full py-2.5 rounded-xl bg-[#0B3D91] text-white text-xs font-bold font-['Poppins'] cursor-pointer"
              >
                Copiar Código y Cerrar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
