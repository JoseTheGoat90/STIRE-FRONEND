import React from 'react';
import { motion } from 'motion/react';

export const TechBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Base Gris Neutro clean background (#F7F9FC) */}
      <div className="absolute inset-0 bg-[#F7F9FC]" />

      {/* Gentle ambient watercolor-like glows with smooth breathing animation */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.08, 0.14, 0.08],
          x: [0, 20, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#0B3D91] blur-[120px] pointer-events-none"
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.07, 0.12, 0.07],
          x: [0, -25, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#7B2FBF] blur-[130px] pointer-events-none"
      />

      <motion.div
        animate={{
          scale: [0.9, 1.1, 0.9],
          opacity: [0.06, 0.11, 0.06],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-[#00C2A8] blur-[160px] pointer-events-none"
      />

      {/* Subtle clean geometric dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(#0B3D91 1.2px, transparent 1.2px), radial-gradient(#7B2FBF 1.2px, transparent 1.2px)`,
          backgroundSize: '28px 28px',
          backgroundPosition: '0 0, 14px 14px',
        }}
      />
    </div>
  );
};

