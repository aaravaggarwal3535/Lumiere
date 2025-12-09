import React, { useEffect, useState } from 'react';

const LOGS = [
  'Scanning handwriting vector...',
  'Extracting symbolic expressions...',
  'Identifying logic path...',
  'Detecting integration error...',
  'Consulting Socratic database...',
  'Formulating guidance...',
  'Optimizing neural weights...',
  'Synthesizing verbal response...',
  'Analyzing algebraic structure...',
  'Verifying step-by-step consistency...'
];

export const ReasoningTerminal: React.FC = () => {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    let index = 0;
    // Initial logs to populate quickly
    setLines([LOGS[0]]);

    const interval = setInterval(() => {
      index++;
      setLines(prev => {
        const nextLog = LOGS[index % LOGS.length];
        const newLines = [...prev, nextLog];
        // Keep only the last 4 lines to fit the card nicely
        if (newLines.length > 4) return newLines.slice(newLines.length - 4);
        return newLines;
      });
    }, 600); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[400px] z-50">
      <div className="bg-black/80 backdrop-blur-xl border border-cyber-neon/30 rounded-lg p-4 shadow-[0_0_50px_rgba(0,255,157,0.15)] relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyber-neon animate-pulse"></div>
            <span className="text-cyber-neon font-bold text-[10px] uppercase tracking-[0.2em]">Reasoning Engine</span>
          </div>
          <span className="text-white/30 text-[10px]">v2.5.0</span>
        </div>

        {/* Content */}
        <div className="font-mono text-xs space-y-1.5 h-24 flex flex-col justify-end">
          {lines.map((line, i) => (
            <div key={i} className="text-cyber-neon/90 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <span className="text-white/20 text-[10px]">{`>>`}</span>
              <span className="drop-shadow-[0_0_8px_rgba(0,255,157,0.5)]">{line}</span>
            </div>
          ))}
          <div className="h-4 flex items-center">
            <span className="w-2 h-4 bg-cyber-neon/50 animate-pulse block"></span>
          </div>
        </div>

        {/* Decor */}
        <div className="absolute top-0 right-0 p-1">
          <div className="w-2 h-2 border-t border-r border-cyber-neon/50"></div>
        </div>
        <div className="absolute bottom-0 left-0 p-1">
          <div className="w-2 h-2 border-b border-l border-cyber-neon/50"></div>
        </div>
      </div>
    </div>
  );
};