import React from 'react';
import { Button } from './Button';

interface TeachingOverlayProps {
  content: string;
  onClose: () => void;
}

export const TeachingOverlay: React.FC<TeachingOverlayProps> = ({ content, onClose }) => {
  // Clean content from dollar signs for display
  const cleanContent = (text: string) => {
    return text.replace(/\$+/g, '').replace(/\\/g, '');
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[500px] z-[60] animate-in slide-in-from-right duration-500">
      <div className="h-full w-full bg-blue-950/95 backdrop-blur-xl border-l-2 border-blue-400 shadow-[-20px_0_100px_rgba(59,130,246,0.5)] flex flex-col p-8 relative overflow-hidden">
        
        {/* Holographic Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.15)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8 z-10 border-b border-blue-500/30 pb-4">
          <div className="flex flex-col">
            <h2 className="text-blue-200 font-bold text-2xl uppercase tracking-[0.2em] drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">Teaching_Mode</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              <span className="text-blue-400 text-xs font-mono">SIMULATION_ACTIVE</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-blue-900/50 border border-blue-400/50 flex items-center justify-center hover:bg-blue-400 hover:text-black transition-all duration-300 text-blue-300 group"
          >
            <svg className="w-6 h-6 transform group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-grow overflow-y-auto custom-scrollbar z-10 relative pr-2">
          <div className="bg-black/60 border border-blue-500/30 rounded-lg p-6 font-mono text-sm leading-relaxed text-blue-100 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] whitespace-pre-wrap">
            {cleanContent(content)}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 z-10">
          <Button onClick={onClose} variant="secondary" className="w-full border-blue-500/50 text-blue-300 hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            ACKNOWLEDGE_&_CLOSE
          </Button>
        </div>

        {/* Corner Decor */}
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-blue-400/50 rounded-br-2xl pointer-events-none m-4"></div>
      </div>
    </div>
  );
};