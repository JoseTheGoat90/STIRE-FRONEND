import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LogOut,
  Sparkles,
  BookOpen,
  LayoutDashboard,
  BrainCircuit,
  GraduationCap,
  Calendar,
  User,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Flame,
  CheckSquare,
  Send,
  Bell,
  Search,
  Bot,
  Layers,
  ArrowUpRight,
  Maximize2,
  Minimize2,
  Users,
  ShieldAlert,
  Server,
  Activity,
  FileText,
  Sliders,
  Sun,
  Moon,
  RefreshCw,
  Award,
  Clock,
  ChevronDown,
  ExternalLink,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { UserSession, UserRole } from '../types';
import { StudentDashboardView } from './StudentDashboardView';
import { TeacherDashboardView } from './TeacherDashboardView';

interface WelcomeDashboardProps {
  session: UserSession;
  onSignOut: () => void;
}

export const WelcomeDashboard: React.FC<WelcomeDashboardProps> = ({ session, onSignOut }) => {
  const role = session.role;
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [dashboardTheme, setDashboardTheme] = useState<'dark' | 'light'>('dark');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // AI Tutor state
  const [tutorQuery, setTutorQuery] = useState('');
  const [tutorChat, setTutorChat] = useState<{ sender: 'user' | 'tutor'; text: string; time: string }[]>([
    {
      sender: 'tutor',
      text: `¡Hola ${session.name}! Soy tu Tutor Inteligente de STIRE Soft. Estoy analizando tu sesión institucional. ¿En qué concepto te gustaría profundizar hoy?`,
      time: 'Ahora',
    },
  ]);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleAskTutor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorQuery.trim()) return;

    const userText = tutorQuery;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTutorChat((prev) => [...prev, { sender: 'user', text: userText, time: now }]);
    setTutorQuery('');

    setTimeout(() => {
      let reply = 'Una variable en programación almacena un dato en memoria con un identificador único. En Java y Python se clasifican en tipos primitivos y referencias de objetos.';
      if (userText.toLowerCase().includes('quiz') || userText.toLowerCase().includes('evaluacion')) {
        reply = 'Para el Quiz de "¿Qué es una variable?", te recomiendo repasar la diferencia entre asignación `=` y comparación lógica `==`. ¡Tu curva de dominio está al 68%!';
      } else if (userText.toLowerCase().includes('docente') || userText.toLowerCase().includes('toscano')) {
        reply = 'El Prof. Toscano ha programado la siguiente sesión práctica para este jueves en el laboratorio de cómputo. Tienes habilitado el banco de ejercicios preparatorios.';
      }
      setTutorChat((prev) => [...prev, { sender: 'tutor', text: reply, time: now }]);
    }, 700);
  };

  const isDark = dashboardTheme === 'dark';

  // Navigation tabs config for admin console
  const getNavItems = () => {
    return [
      { id: 'inicio', label: 'Telemetría del Sistema', icon: Server },
      { id: 'usuarios', label: 'Gestión de Cuentas', icon: Users, badge: '1,420' },
      { id: 'modelos', label: 'Modelos IA & Nodos', icon: BrainCircuit, badge: 'v2.1' },
      { id: 'seguridad', label: 'Auditoría & WCAG', icon: ShieldAlert },
      { id: 'config', label: 'Configuración Global', icon: Sliders },
    ];
  };

  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (role === 'student') {
    return <StudentDashboardView session={session} onSignOut={onSignOut} />;
  }

  if (role === 'teacher') {
    return <TeacherDashboardView session={session} onSignOut={onSignOut} />;
  }

  const navItems = getNavItems();

  return (
    <div
      className={`w-full h-screen min-h-screen flex flex-col overflow-hidden transition-colors duration-200 ${
        isDark ? 'bg-[#070e24] text-slate-100' : 'bg-[#F7F9FC] text-slate-800'
      }`}
    >
      {/* 1. FULL-WIDTH ENTERPRISE HEADER */}
      <header
        className={`w-full h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between border-b flex-shrink-0 z-30 transition-colors ${
          isDark
            ? 'bg-[#0a1435]/95 border-slate-800/90 text-white'
            : 'bg-white/95 border-slate-200 shadow-sm text-slate-800'
        }`}
      >
        {/* Left: Brand logo with [ST] badge */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isDark
                ? 'bg-[#070e24] border-slate-800 text-slate-300 hover:text-white'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-[#0B3D91]'
            }`}
            title={sidebarOpen ? 'Ocultar barra lateral' : 'Desplegar barra lateral'}
          >
            {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B3D91] via-[#7B2FBF] to-[#00C2A8] p-[1.5px] shadow-sm flex-shrink-0">
            <div
              className={`w-full h-full rounded-[10px] flex items-center justify-center font-bold text-xs font-['Poppins'] ${
                isDark ? 'bg-[#070e24] text-white' : 'bg-white text-[#0B3D91]'
              }`}
            >
              ST
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-bold tracking-tight text-[#0B3D91] font-['Poppins']">
                STIRE
              </span>
              <span
                className={`text-base sm:text-lg font-light font-['Poppins'] ${
                  isDark ? 'text-slate-200' : 'text-slate-700'
                }`}
              >
                Soft
              </span>
            </div>

            <span className="hidden md:inline-block text-[10px] px-2 py-0.5 rounded-full font-mono bg-[#0B3D91]/15 text-[#0B3D91] font-bold border border-[#0B3D91]/30">
              v2.1 Enterprise
            </span>

            <span className="hidden xl:inline-block text-xs text-slate-400 font-medium pl-3 border-l border-slate-300 dark:border-slate-700">
              Universidad de Córdoba • Sistema Tutor Inteligente
            </span>
          </div>
        </div>

        {/* Center: Quick Search bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
          <div
            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
              isDark
                ? 'bg-[#070e24] border-slate-800 text-slate-200 focus-within:border-[#00C2A8]'
                : 'bg-slate-100 border-slate-200 text-slate-800 focus-within:border-[#00C2A8] focus-within:bg-white'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar temas, unidades curriculares, quizzes o estudiantes..."
              className="w-full bg-transparent outline-none placeholder:text-slate-400 text-xs"
            />
            <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded border border-slate-400/30">
              ⌘K
            </span>
          </div>
        </div>

        {/* Right: Quick actions, Role pill, Fullscreen toggle & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Full-Screen Toggle Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isDark
                ? 'bg-[#070e24] border-slate-800 text-slate-300 hover:text-white hover:border-[#00C2A8]'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-[#0B3D91] hover:border-[#0B3D91]'
            }`}
            title={isFullscreen ? 'Salir de pantalla completa' : 'Activar pantalla completa'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Theme switcher */}
          <button
            type="button"
            onClick={() => setDashboardTheme(isDark ? 'light' : 'dark')}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isDark
                ? 'bg-[#070e24] border-slate-800 text-amber-400 hover:bg-slate-800'
                : 'bg-slate-50 border-slate-200 text-[#7B2FBF] hover:bg-slate-100'
            }`}
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notification bell */}
          <button
            type="button"
            className={`p-2 rounded-xl border relative transition-all cursor-pointer ${
              isDark
                ? 'bg-[#070e24] border-slate-800 text-slate-300 hover:text-white'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00C2A8]" />
          </button>

          {/* User Role Badge with semantic color */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-[#0B3D91]/10 border-[#0B3D91]/40 text-[#0B3D91] dark:text-[#8eb0f7]">
            <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span className="text-xs font-bold font-['Poppins']">{session.roleTitle}</span>
          </div>

          {/* User Profile Info & Sign Out */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-300 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs font-['Poppins'] text-white bg-gradient-to-br from-[#0B3D91] to-[#7B2FBF]">
              {session.name.charAt(0)}
            </div>

            <div className="hidden md:block text-left leading-tight">
              <div className="text-xs font-bold font-['Poppins'] truncate max-w-[130px]">
                {session.name}
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate max-w-[130px]">
                {session.institutionalId || 'UNICOR-2026'}
              </div>
            </div>

            <button
              id="btn-signout-fullscreen"
              type="button"
              onClick={onSignOut}
              className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. FULL-SCREEN WORKSPACE BODY (SIDEBAR + MAIN CONTENT) */}
      <div className="flex-1 flex overflow-hidden w-full">
        {/* Full-Height Desktop Sidebar */}
        {sidebarOpen && (
          <aside
            className={`w-56 sm:w-64 border-r flex flex-col justify-between p-3 sm:p-4 flex-shrink-0 transition-colors ${
              isDark ? 'bg-[#08102a]/95 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="space-y-4">
              <div className="px-3 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-400">
                  Navegación del Software
                </span>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isSelected = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0B3D91] text-white font-bold shadow-md shadow-[#0B3D91]/25'
                          : isDark
                          ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                            isSelected
                              ? isDark
                                ? 'bg-[#070e24] text-white'
                                : 'bg-white text-slate-900'
                              : 'bg-slate-700/50 text-slate-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Institutional footer in sidebar */}
            <div
              className={`p-3 rounded-2xl border text-xs space-y-1.5 ${
                isDark ? 'bg-[#060b1e] border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase font-mono text-[#00C2A8]">
                  Estado ITS
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-500 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  En Línea
                </span>
              </div>
              <div className="text-[11px] font-medium leading-tight">
                Universidad de Córdoba
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate">
                ID: {session.institutionalId || 'UNICOR-2026-SYS'}
              </div>
            </div>
          </aside>
        )}

        {/* 3. MAIN FULL-SCREEN CONTENT AREA */}
        <main
          className={`flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 ${
            isDark ? 'bg-[#070e24]' : 'bg-[#F7F9FC]'
          }`}
        >
          {/* Top Welcome Title & Role Status Banner across full width */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-['Poppins']">
                  Bienvenido, {session.name}
                </h1>
                <span className="animate-bounce">👋</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Consola Central de Operaciones y Servicios STIRE Soft • Universidad de Córdoba
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Semestre 2026-1
              </span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Sesión Activa
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ROLE VIEW 3: ADMINISTRADOR (Gestión STIRE)                                 */}
          {/* ========================================================================= */}
          {role === 'admin' && (
            <>
              {/* Metric cards for system admin */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  className={`p-5 rounded-2xl border transition-all ${
                    isDark ? 'bg-[#0a1435] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <span className="text-xs text-slate-400 font-semibold">Disponibilidad Servidor ITS</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black font-['Poppins'] text-emerald-500">99.98%</span>
                    <span className="text-xs font-bold text-emerald-500">Operativo</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">Uptime de 42 días continuos</p>
                </div>

                <div
                  className={`p-5 rounded-2xl border transition-all ${
                    isDark ? 'bg-[#0a1435] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <span className="text-xs text-slate-400 font-semibold">Alumnos Concurrentes</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black font-['Poppins']">342</span>
                    <span className="text-xs font-bold text-[#00C2A8]">En línea</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">Pico horario 10:00 AM - 12:00 PM</p>
                </div>

                <div
                  className={`p-5 rounded-2xl border transition-all ${
                    isDark ? 'bg-[#0a1435] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <span className="text-xs text-slate-400 font-semibold">Consultas IA / Día</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black font-['Poppins']">14,290</span>
                    <span className="text-xs font-bold text-[#7B2FBF]">Latencia 128ms</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">Motor v2.1 balanceado</p>
                </div>

                <div
                  className={`p-5 rounded-2xl border transition-all ${
                    isDark ? 'bg-[#0a1435] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <span className="text-xs text-slate-400 font-semibold">Cumplimiento WCAG 2.1 AA</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black font-['Poppins'] text-[#0B3D91] dark:text-[#8eb0f7]">
                      100%
                    </span>
                    <span className="text-xs font-bold text-emerald-500">Auditoría OK</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">Contraste, lectores de pantalla y teclado</p>
                </div>
              </div>

              {/* System Console & Services status */}
              <div
                className={`rounded-2xl border p-5 space-y-4 ${
                  isDark ? 'bg-[#0a1435]/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-bold font-['Poppins']">
                      Nodos y Servicios Activos de STIRE Soft
                    </h3>
                    <p className="text-xs text-slate-400">
                      Infraestructura en la nube y base de conocimiento institucional de la Universidad de Córdoba
                    </p>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-[#00C2A8] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Recargar Métricas</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className={`p-4 rounded-xl border ${
                      isDark ? 'bg-[#060b1e] border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Servicio de Inferencia ITS</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">
                        Normal
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-2">Uso de CPU: 24% • Memoria: 3.2 GB</div>
                  </div>

                  <div
                    className={`p-4 rounded-xl border ${
                      isDark ? 'bg-[#060b1e] border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Base de Conocimiento Curricular</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">
                        Sincronizada
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-2">84 Guías de estudio indexadas</div>
                  </div>

                  <div
                    className={`p-4 rounded-xl border ${
                      isDark ? 'bg-[#060b1e] border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Autenticación Institucional UNICOR</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">
                        Activo
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-2">Protocolo OAuth / JWT seguro</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};
