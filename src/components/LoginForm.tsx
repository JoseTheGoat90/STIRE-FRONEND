import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Settings,
  UserCheck,
  User,
  BookOpen,
  Check,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { AuthMode, UserRole, UserSession } from '../types';

interface LoginFormProps {
  cardTheme?: 'light' | 'dark';
  onSuccess: (session: UserSession) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ cardTheme = 'light', onSuccess }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  // Form fields
  const [name, setName] = useState('');
  const [institutionalEmail, setInstitutionalEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [recoverySent, setRecoverySent] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [focusedField, setFocusedField] = useState<'name' | 'email' | 'password' | null>(null);
  const [badgePulseKey, setBadgePulseKey] = useState(0);

  // Email validation helper
  const isUnicorEmail = institutionalEmail.trim().toLowerCase().endsWith('@unicor.edu.co');

  // Password strength for registration
  const hasMinLength = password.length >= 6;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const strengthScore = [hasMinLength, hasNumber, hasSpecial].filter(Boolean).length;

  // Track Caps Lock on password input
  const handlePasswordKeyEvent = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState('CapsLock'));
    }
  };

  const triggerLoginSuccess = (sessionData: UserSession) => {
    setIsLoading(false);
    setIsSuccess(true);
    setTimeout(() => {
      onSuccess(sessionData);
    }, 650);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (authMode === 'recovery') {
      if (!institutionalEmail || !institutionalEmail.includes('@')) {
        setErrorMsg('Por favor ingresa un correo institucional válido (@unicor.edu.co)');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setRecoverySent(true);
      }, 900);
      return;
    }

    if (!institutionalEmail) {
      setErrorMsg('Ingresa tu correo institucional');
      return;
    }

    if (!password || password.length < 4) {
      setErrorMsg('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    if (authMode === 'register' && !name.trim()) {
      setErrorMsg('Por favor escribe tu nombre completo');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const isTeacher =
        institutionalEmail.toLowerCase().includes('toscano') ||
        institutionalEmail.toLowerCase().includes('docente') ||
        selectedRole === 'teacher';
      const isAdmin =
        institutionalEmail.toLowerCase().includes('admin') || selectedRole === 'admin';

      const determinedRole: UserRole = isAdmin ? 'admin' : isTeacher ? 'teacher' : 'student';
      const roleTitle =
        determinedRole === 'student'
          ? 'Estudiante'
          : determinedRole === 'teacher'
          ? 'Docente'
          : 'Administrador';

      triggerLoginSuccess({
        email: institutionalEmail,
        name:
          name.trim() ||
          (determinedRole === 'student'
            ? 'Pedro Romero'
            : determinedRole === 'teacher'
            ? 'Prof. Toscano'
            : 'Gestión TI'),
        role: determinedRole,
        roleTitle,
        institutionalId: studentCode.trim() || 'UNICOR-2026-884',
        token: 'stire_jwt_' + Math.random().toString(36).substring(2),
      });
    }, 900);
  };

  // Quick demo with realistic fluid typing animation
  const handleQuickDemo = (role: UserRole) => {
    setErrorMsg(null);
    setAuthMode('login');

    const demoData =
      role === 'student'
        ? {
            email: 'pedro.romero@unicor.edu.co',
            pass: 'unicor2026',
            session: {
              email: 'pedro.romero@unicor.edu.co',
              name: 'Pedro Romero',
              role: 'student' as UserRole,
              roleTitle: 'Estudiante',
              institutionalId: 'UNICOR-ING-202410',
              token: 'stire_demo_student_' + Date.now(),
            },
          }
        : role === 'teacher'
        ? {
            email: 'toscano@unicor.edu.co',
            pass: 'docente991',
            session: {
              email: 'toscano@unicor.edu.co',
              name: 'Prof. Toscano',
              role: 'teacher' as UserRole,
              roleTitle: 'Docente Titular',
              institutionalId: 'UNICOR-DOC-10492',
              token: 'stire_demo_teacher_' + Date.now(),
            },
          }
        : {
            email: 'admin.stire@unicor.edu.co',
            pass: 'seguridad88',
            session: {
              email: 'admin.stire@unicor.edu.co',
              name: 'Gestión STIRE',
              role: 'admin' as UserRole,
              roleTitle: 'Administrador',
              institutionalId: 'UNICOR-ADM-001',
              token: 'stire_demo_admin_' + Date.now(),
            },
          };

    // Auto-fill animation
    setInstitutionalEmail(demoData.email);
    setPassword(demoData.pass);
    setIsLoading(true);

    setTimeout(() => {
      triggerLoginSuccess(demoData.session);
    }, 750);
  };

  const isLight = cardTheme === 'light';

  return (
    <div className="w-full max-w-[490px] mx-auto perspective-1000">
      {/* Central Login Card matching exact structure from user image + Colored Elevation */}
      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={
          isLight
            ? {
                boxShadow:
                  '0 24px 48px -12px rgba(11, 61, 145, 0.08), 0 12px 24px -8px rgba(123, 47, 191, 0.06), 0 0 0 1px rgba(11, 61, 145, 0.05)',
              }
            : {
                boxShadow:
                  '0 25px 50px -12px rgba(11, 61, 145, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              }
        }
        className={`relative rounded-3xl p-7 sm:p-9 backdrop-blur-2xl transition-colors duration-300 overflow-hidden ${
          isLight
            ? 'bg-white/98 border border-slate-200/90'
            : 'bg-[#09112a]/95 border border-slate-700/60'
        }`}
      >
        {/* Top subtle brand line with #0B3D91, #7B2FBF, #00C2A8 */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0B3D91] via-[#7B2FBF] to-[#00C2A8]" />

        {/* Centered [ST] Icon Badge with Reactive Micro-Interactions */}
        <div className="flex flex-col items-center justify-center text-center mb-5">
          <motion.div
            key={badgePulseKey}
            animate={
              focusedField === 'password'
                ? {
                    scale: [1, 1.06, 1],
                    boxShadow: [
                      '0 0 0px rgba(123,47,191,0)',
                      '0 0 24px rgba(123,47,191,0.4)',
                      '0 0 14px rgba(123,47,191,0.25)',
                    ],
                  }
                : { scale: 1 }
            }
            transition={{ duration: 0.3 }}
            className={`w-14 h-14 rounded-2xl p-[2px] transition-all duration-300 mb-3.5 ${
              focusedField === 'password'
                ? 'bg-gradient-to-br from-[#7B2FBF] to-[#00C2A8] shadow-lg shadow-[#7B2FBF]/30'
                : 'bg-gradient-to-br from-[#0B3D91] to-[#7B2FBF] shadow-md shadow-[#0B3D91]/20'
            }`}
          >
            <div
              className={`w-full h-full rounded-[14px] flex items-center justify-center border transition-colors ${
                isLight ? 'bg-white border-slate-100' : 'bg-[#070d20] border-white/10'
              }`}
            >
              {focusedField === 'password' ? (
                <ShieldCheck
                  className={`w-7 h-7 transition-colors ${
                    isLight ? 'text-[#7B2FBF]' : 'text-[#c084fc]'
                  }`}
                />
              ) : (
                <span
                  className={`text-xl font-black tracking-tighter font-['Poppins'] ${
                    isLight ? 'text-[#0B3D91]' : 'text-white'
                  }`}
                >
                  ST
                </span>
              )}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={authMode}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <h1
                className={`text-2xl font-bold tracking-tight font-['Poppins'] ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {authMode === 'login' && 'Iniciar Sesión'}
                {authMode === 'register' && 'Crear Cuenta STIRE'}
                {authMode === 'recovery' && 'Restablecer Clave'}
              </h1>
              <p
                className={`text-xs mt-1 max-w-[340px] leading-relaxed ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                {authMode === 'login' &&
                  'Ingresa a tu entorno de aprendizaje y tutoría inteligente'}
                {authMode === 'register' &&
                  'Registra tu acceso institucional a la plataforma STIRE Soft'}
                {authMode === 'recovery' &&
                  'Ingresa tu correo institucional para enviarte un enlace seguro'}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Error notification */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs overflow-hidden border ${
                isLight
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recovery State Confirmation */}
        {authMode === 'recovery' && recoverySent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-5 space-y-4"
          >
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#00C2A8]/15 border border-[#00C2A8]/40 flex items-center justify-center text-[#00C2A8]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3
                className={`text-sm font-bold font-['Poppins'] ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                ¡Enlace de recuperación enviado!
              </h3>
              <p
                className={`text-xs mt-1 max-w-xs mx-auto ${
                  isLight ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                Hemos enviado instrucciones a{' '}
                <span className="text-[#00C2A8] font-mono font-semibold">
                  {institutionalEmail}
                </span>
                . Revisa tu bandeja institucional.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setRecoverySent(false);
                setAuthMode('login');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                  : 'bg-[#101b3d] hover:bg-[#182859] text-slate-200 border-slate-700'
              }`}
            >
              Volver al inicio de sesión
            </button>
          </motion.div>
        ) : (
          /* Form Content with Spatial Animation */
          <AnimatePresence mode="wait">
            <motion.form
              key={authMode}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: authMode === 'login' ? -12 : 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: authMode === 'login' ? 12 : -12 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="space-y-4"
            >
              {/* Registration specific fields */}
              {authMode === 'register' && (
                <>
                  <div className="space-y-1.5">
                    <label
                      className={`block text-xs font-semibold ${
                        isLight ? 'text-slate-700' : 'text-slate-300'
                      }`}
                    >
                      Nombre Completo
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="input-name"
                        type="text"
                        required
                        value={name}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej. Pedro Romero"
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm placeholder-slate-400 focus:outline-none focus:border-[#00C2A8] focus:ring-2 focus:ring-[#00C2A8]/20 transition-all ${
                          isLight
                            ? 'bg-white border-slate-300 text-slate-900'
                            : 'bg-[#060b1e] border-slate-700/80 text-slate-100'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      className={`block text-xs font-semibold ${
                        isLight ? 'text-slate-700' : 'text-slate-300'
                      }`}
                    >
                      Tipo de Usuario
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRole('student')}
                        className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          selectedRole === 'student'
                            ? isLight
                              ? 'bg-[#00C2A8]/15 border-[#00C2A8] text-[#008775] font-semibold ring-2 ring-[#00C2A8]/20'
                              : 'bg-[#00C2A8]/15 border-[#00C2A8] text-[#00C2A8] ring-2 ring-[#00C2A8]/20'
                            : isLight
                            ? 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                            : 'bg-[#060b1e] border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        Estudiante
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRole('teacher')}
                        className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          selectedRole === 'teacher'
                            ? isLight
                              ? 'bg-[#7B2FBF]/15 border-[#7B2FBF] text-[#7B2FBF] font-semibold ring-2 ring-[#7B2FBF]/20'
                              : 'bg-[#7B2FBF]/20 border-[#7B2FBF] text-[#c084fc] ring-2 ring-[#7B2FBF]/20'
                            : isLight
                            ? 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                            : 'bg-[#060b1e] border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        Docente
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Field 1: Correo Institucional with Real-Time Validation Feedback */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="input-institutional-email"
                    className={`block text-xs font-semibold ${
                      isLight ? 'text-slate-700' : 'text-slate-300'
                    }`}
                  >
                    Correo Institucional
                  </label>

                  {/* Real-time Unicor domain indicator badge */}
                  {isUnicorEmail && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-[#008f7b] bg-[#00C2A8]/15 px-2 py-0.5 rounded-full"
                    >
                      <Check className="w-3 h-3 text-[#008f7b]" />
                      Dominio Unicor Verificado
                    </motion.span>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="input-institutional-email"
                    type="email"
                    required
                    value={institutionalEmail}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setInstitutionalEmail(e.target.value)}
                    placeholder="usuario@unicor.edu.co"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm placeholder-slate-400 transition-all font-sans focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2A8] ${
                      isUnicorEmail
                        ? 'border-[#00C2A8] ring-1 ring-[#00C2A8]/30'
                        : focusedField === 'email'
                        ? 'border-[#0B3D91] ring-2 ring-[#0B3D91]/15'
                        : isLight
                        ? 'bg-white border-slate-300 text-slate-900'
                        : 'bg-[#060b1e] border-slate-700/80 text-slate-100'
                    } ${isLight ? 'bg-white text-slate-900' : 'bg-[#060b1e] text-slate-100'}`}
                  />
                  {isUnicorEmail && (
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                      <CheckCircle2 className="w-4 h-4 text-[#00C2A8]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Field 2: Contraseña + Caps Lock Detector + Visibility Toggle */}
              {authMode !== 'recovery' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="input-password"
                      className={`block text-xs font-semibold ${
                        isLight ? 'text-slate-700' : 'text-slate-300'
                      }`}
                    >
                      Contraseña
                    </label>
                    {authMode === 'login' && (
                      <button
                        id="link-forgot-password"
                        type="button"
                        onClick={() => {
                          setAuthMode('recovery');
                          setErrorMsg(null);
                        }}
                        className={`text-xs transition-colors cursor-pointer ${
                          isLight
                            ? 'text-slate-500 hover:text-[#0B3D91]'
                            : 'text-slate-400 hover:text-[#00C2A8]'
                        }`}
                      >
                        ¿Olvidaste tu clave?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="input-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => {
                        setFocusedField(null);
                        setCapsLockActive(false);
                      }}
                      onKeyDown={handlePasswordKeyEvent}
                      onKeyUp={handlePasswordKeyEvent}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm placeholder-slate-400 transition-all font-sans focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2A8] ${
                        focusedField === 'password'
                          ? 'border-[#7B2FBF] ring-2 ring-[#7B2FBF]/20'
                          : isLight
                          ? 'bg-white border-slate-300 text-slate-900'
                          : 'bg-[#060b1e] border-slate-700/80 text-slate-100'
                      } ${isLight ? 'bg-white text-slate-900' : 'bg-[#060b1e] text-slate-100'}`}
                    />
                    <button
                      id="btn-toggle-password"
                      type="button"
                      onClick={() => {
                        setShowPassword(!showPassword);
                        setBadgePulseKey((prev) => prev + 1);
                      }}
                      className={`absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors cursor-pointer ${
                        isLight
                          ? 'text-slate-400 hover:text-slate-700'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Caps Lock warning indicator */}
                  <AnimatePresence>
                    {capsLockActive && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-[11px] font-medium"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        <span>Bloq Mayús está activado</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Password strength meter for register mode */}
                  {authMode === 'register' && password.length > 0 && (
                    <div className="pt-1 space-y-1">
                      <div className="flex gap-1.5 h-1">
                        <div
                          className={`flex-1 rounded-full transition-all duration-300 ${
                            strengthScore >= 1 ? 'bg-[#7B2FBF]' : 'bg-slate-200'
                          }`}
                        />
                        <div
                          className={`flex-1 rounded-full transition-all duration-300 ${
                            strengthScore >= 2 ? 'bg-[#0B3D91]' : 'bg-slate-200'
                          }`}
                        />
                        <div
                          className={`flex-1 rounded-full transition-all duration-300 ${
                            strengthScore >= 3 ? 'bg-[#00C2A8]' : 'bg-slate-200'
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Button with Shimmer and Morphing State */}
              <motion.button
                id="btn-submit-login"
                type="submit"
                disabled={isLoading || isSuccess}
                whileHover={!isLoading && !isSuccess ? { scale: 1.01 } : {}}
                whileTap={!isLoading && !isSuccess ? { scale: 0.98 } : {}}
                className={`relative w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-[#070e24] bg-[#00C2A8] hover:bg-[#14e2c8] focus:outline-none focus:ring-4 focus:ring-[#00C2A8]/30 shadow-lg shadow-[#00C2A8]/20 transition-all flex items-center justify-center gap-2 font-['Poppins'] cursor-pointer overflow-hidden ${
                  isSuccess ? 'bg-[#00d8bc]' : ''
                }`}
              >
                {/* Shimmer light sweep */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.6,
                    ease: 'linear',
                    repeatDelay: 1.2,
                  }}
                  className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
                />

                {isSuccess ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-2 font-bold"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#070e24]" />
                    <span>¡Acceso concedido!</span>
                  </motion.div>
                ) : isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-[#070e24] border-t-transparent animate-spin" />
                    <span>Validando credenciales...</span>
                  </div>
                ) : (
                  <>
                    <span>
                      {authMode === 'login' && 'Ingresar a la plataforma'}
                      {authMode === 'register' && 'Crear cuenta e ingresar'}
                      {authMode === 'recovery' && 'Enviar enlace de recuperación'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </motion.form>
          </AnimatePresence>
        )}

        {/* Link: "¿No tienes una cuenta aún? Regístrate aquí" */}
        <div className="mt-4 text-center">
          {authMode === 'login' && (
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              ¿No tienes una cuenta aún?{' '}
              <button
                id="link-register"
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMsg(null);
                }}
                className={`font-semibold hover:underline transition-colors cursor-pointer ${
                  isLight
                    ? 'text-[#0B3D91] hover:text-[#7B2FBF]'
                    : 'text-[#00C2A8] hover:text-[#2ee7cf]'
                }`}
              >
                Regístrate aquí
              </button>
            </p>
          )}

          {authMode === 'register' && (
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              ¿Ya tienes una cuenta institucional?{' '}
              <button
                id="link-login-back"
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMsg(null);
                }}
                className={`font-semibold hover:underline transition-colors cursor-pointer ${
                  isLight
                    ? 'text-[#0B3D91] hover:text-[#7B2FBF]'
                    : 'text-[#00C2A8] hover:text-[#2ee7cf]'
                }`}
              >
                Inicia sesión aquí
              </button>
            </p>
          )}

          {authMode === 'recovery' && !recoverySent && (
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMsg(null);
              }}
              className={`text-xs transition-colors cursor-pointer ${
                isLight
                  ? 'text-slate-500 hover:text-slate-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ← Cancelar y volver al inicio
            </button>
          )}
        </div>

        {/* Divider: "O ACCESO RÁPIDO DE DEMOSTRACIÓN" (Matching structure from image) */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div
              className={`w-full border-t ${
                isLight ? 'border-slate-200' : 'border-slate-700/60'
              }`}
            />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
            <span
              className={`px-3 ${
                isLight ? 'bg-white text-slate-400' : 'bg-[#09112a] text-slate-400'
              }`}
            >
              O ACCESO RÁPIDO DE DEMOSTRACIÓN
            </span>
          </div>
        </div>

        {/* 3 Quick Access Cards with semantic identity colors & fluid auto-fill */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Card 1: Estudiante - Pedro Romero (Turquoise #00C2A8) */}
          <button
            id="btn-demo-student"
            type="button"
            onClick={() => handleQuickDemo('student')}
            className={`p-3 rounded-2xl border text-center transition-all duration-200 group flex flex-col items-center justify-center cursor-pointer shadow-sm hover:shadow-md ${
              isLight
                ? 'bg-[#F7F9FC] hover:bg-[#00C2A8]/10 border-slate-200 hover:border-[#00C2A8] hover:shadow-[#00C2A8]/15'
                : 'bg-[#060b1e]/90 hover:bg-[#0c1638] border-slate-800 hover:border-[#00C2A8] hover:shadow-[#00C2A8]/15'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-[#00C2A8]/15 text-[#008f7b] flex items-center justify-center mb-1.5 group-hover:scale-110 group-hover:bg-[#00C2A8] group-hover:text-white transition-all">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div
              className={`text-xs font-bold font-['Poppins'] ${
                isLight
                  ? 'text-slate-800 group-hover:text-[#008f7b]'
                  : 'text-slate-200 group-hover:text-white'
              }`}
            >
              Estudiante
            </div>
            <div
              className={`text-[10px] mt-0.5 truncate w-full ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              Pedro Romero
            </div>
          </button>

          {/* Card 2: Docente - Prof. Toscano (Purple #7B2FBF) */}
          <button
            id="btn-demo-teacher"
            type="button"
            onClick={() => handleQuickDemo('teacher')}
            className={`p-3 rounded-2xl border text-center transition-all duration-200 group flex flex-col items-center justify-center cursor-pointer shadow-sm hover:shadow-md ${
              isLight
                ? 'bg-[#F7F9FC] hover:bg-[#7B2FBF]/10 border-slate-200 hover:border-[#7B2FBF] hover:shadow-[#7B2FBF]/15'
                : 'bg-[#060b1e]/90 hover:bg-[#16123b] border-slate-800 hover:border-[#7B2FBF] hover:shadow-[#7B2FBF]/15'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-[#7B2FBF]/15 text-[#7B2FBF] flex items-center justify-center mb-1.5 group-hover:scale-110 group-hover:bg-[#7B2FBF] group-hover:text-white transition-all">
              <UserCheck className="w-4 h-4" />
            </div>
            <div
              className={`text-xs font-bold font-['Poppins'] ${
                isLight
                  ? 'text-slate-800 group-hover:text-[#7B2FBF]'
                  : 'text-slate-200 group-hover:text-white'
              }`}
            >
              Docente
            </div>
            <div
              className={`text-[10px] mt-0.5 truncate w-full ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              Prof. Toscano
            </div>
          </button>

          {/* Card 3: Admin - Gestión (Blue #0B3D91) */}
          <button
            id="btn-demo-admin"
            type="button"
            onClick={() => handleQuickDemo('admin')}
            className={`p-3 rounded-2xl border text-center transition-all duration-200 group flex flex-col items-center justify-center cursor-pointer shadow-sm hover:shadow-md ${
              isLight
                ? 'bg-[#F7F9FC] hover:bg-[#0B3D91]/10 border-slate-200 hover:border-[#0B3D91] hover:shadow-[#0B3D91]/15'
                : 'bg-[#060b1e]/90 hover:bg-[#0d1e44] border-slate-800 hover:border-[#0B3D91] hover:shadow-[#0B3D91]/15'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-[#0B3D91]/15 text-[#0B3D91] flex items-center justify-center mb-1.5 group-hover:scale-110 group-hover:bg-[#0B3D91] group-hover:text-white transition-all">
              <Settings className="w-4 h-4" />
            </div>
            <div
              className={`text-xs font-bold font-['Poppins'] ${
                isLight
                  ? 'text-slate-800 group-hover:text-[#0B3D91]'
                  : 'text-slate-200 group-hover:text-white'
              }`}
            >
              Admin
            </div>
            <div
              className={`text-[10px] mt-0.5 truncate w-full ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              Gestión
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

