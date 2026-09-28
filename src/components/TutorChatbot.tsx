import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  X,
  Send,
  Minimize2,
  Maximize2,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  time: string;
  actionPrompt?: string;
}

interface TutorChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  activeUnitTitle?: string;
}

export const TutorChatbot: React.FC<TutorChatbotProps> = ({
  isOpen,
  onClose,
  studentName,
  activeUnitTitle = 'Unidad 1: Variables y tipos de datos',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'tutor',
      text: `¡Hola ${studentName}! Soy tu Tutor Inteligente de STIRE Soft. Estoy sincronizado con ${activeUnitTitle}. ¿Tienes alguna duda sobre la asignación de memoria o tipos de variables?`,
      time: 'Ahora',
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputQuery).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Simulated pedagogical response from STIRE Intelligent Tutor System
    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();

      if (lower.includes('variable') || lower.includes('que es')) {
        reply =
          'En computación, una variable es una posición reservada en la memoria RAM identificada por un nombre simbólico. Guarda un valor que puede modificarse durante la ejecución del programa.';
      } else if (lower.includes('tipo') || lower.includes('primitivo') || lower.includes('datos')) {
        reply =
          'Los tipos de datos primitivos en programación estructurada son: enteros (int), punto flotante (float/double), caracteres (char) y booleanos (true/false). Cada uno define la cantidad de bytes que ocupará en memoria.';
      } else if (lower.includes('quiz') || lower.includes('pregunta') || lower.includes('ejercicio')) {
        reply =
          'Para el quiz de "¿Qué es una variable?", recuerda: la asignación `=` almacena el resultado del lado derecho en la variable del lado izquierdo. ¿Deseas hacer un ejercicio guiado ahora?';
      } else if (lower.includes('diferencia') || lower.includes('==') || lower.includes('=')) {
        reply =
          '¡Excelente duda! El operador `=` es de ASIGNACIÓN (guarda un valor: `x = 5`), mientras que `==` es de COMPARACIÓN lógica (pregunta si dos valores son iguales: `x == 5`).';
      } else {
        reply = `He registrado tu inquietud sobre "${text}". Para tu avance en ${activeUnitTitle}, te sugiero repasar los ejercicios prácticos de suma de números y completar el quiz diagnóstico.`;
      }

      const tutorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'tutor',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, tutorMsg]);
      setIsTyping(false);
    }, 600);
  };

  const quickPrompts = [
    '¿Qué es una variable?',
    'Diferencia entre = y ==',
    'Tipos de datos primitivos',
    'Pistas para el Quiz',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`fixed bottom-5 right-5 z-50 flex flex-col bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 font-sans ${
            isExpanded
              ? 'w-[94vw] sm:w-[540px] h-[82vh] max-h-[700px]'
              : 'w-[94vw] sm:w-[380px] h-[520px]'
          }`}
          style={{
            boxShadow: '0 20px 45px -10px rgba(11, 61, 145, 0.18), 0 0 0 1px rgba(0, 194, 168, 0.2)',
          }}
        >
          {/* Header with Robot Silhouette & Gradient Identity */}
          <div className="bg-gradient-to-r from-[#0B3D91] via-[#0e48a8] to-[#7B2FBF] p-3.5 sm:p-4 text-white flex items-center justify-between flex-shrink-0 select-none">
            <div className="flex items-center gap-3">
              {/* Robot Silhouette Icon Badge */}
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#00C2A8] shadow-inner">
                  {/* Silhouette of a Robot */}
                  <Bot className="w-6 h-6 text-[#00C2A8]" strokeWidth={2.2} />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00C2A8] border-2 border-[#0B3D91] rounded-full" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm font-['Poppins'] tracking-tight">
                    Tutor IA STIRE
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#00C2A8]/25 text-[#00C2A8] border border-[#00C2A8]/40 font-semibold">
                    En Vivo
                  </span>
                </div>
                <p className="text-[11px] text-slate-200 truncate max-w-[200px]">
                  Sistema Tutor Inteligente • UNICOR
                </p>
              </div>
            </div>

            {/* Controls: Expand & Close */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title={isExpanded ? 'Reducir tamaño' : 'Ampliar chat'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Cerrar Tutor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Unit Context Strip */}
          <div className="bg-[#F7F9FC] border-b border-slate-200 px-3.5 py-2 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-1.5 truncate">
              <BookOpen className="w-3.5 h-3.5 text-[#00C2A8] flex-shrink-0" />
              <span className="font-medium text-[11px] text-[#0B3D91] truncate font-['Poppins']">
                {activeUnitTitle}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200 flex-shrink-0">
              Adaptativo
            </span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-[#F7F9FC]/60 to-white text-xs">
            {messages.map((msg) => {
              const isTutor = msg.sender === 'tutor';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isTutor ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-end gap-1.5 max-w-[88%]">
                    {isTutor && (
                      <div className="w-6 h-6 rounded-lg bg-[#0B3D91] flex items-center justify-center text-[#00C2A8] flex-shrink-0 mb-1">
                        <Bot className="w-4 h-4" strokeWidth={2.2} />
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-2xl leading-relaxed text-xs shadow-sm ${
                        isTutor
                          ? 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                          : 'bg-[#00C2A8] text-[#0B3D91] font-medium rounded-br-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                <div className="w-6 h-6 rounded-lg bg-[#0B3D91] flex items-center justify-center text-[#00C2A8]">
                  <Bot className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div className="flex items-center gap-1 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00C2A8] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7B2FBF] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B3D91] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-slate-500 ml-1">Escribiendo respuesta...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-2 bg-[#F7F9FC] border-t border-slate-200/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex-shrink-0 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-500" />
              Sugerencias:
            </span>
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-[#00C2A8]/10 text-slate-700 hover:text-[#0B3D91] border border-slate-200 hover:border-[#00C2A8]/50 whitespace-nowrap transition-colors cursor-pointer shadow-2xs font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input Field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Pregúntale a tu tutor sobre la unidad actual..."
              className="flex-1 px-3.5 py-2.5 rounded-xl text-xs bg-[#F7F9FC] border border-slate-200 focus:border-[#00C2A8] focus:bg-white text-slate-800 placeholder:text-slate-400 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="w-10 h-10 rounded-xl bg-[#00C2A8] hover:bg-[#12e2c8] text-[#0B3D91] flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm flex-shrink-0"
              title="Enviar consulta"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
