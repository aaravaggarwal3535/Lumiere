import React from 'react';
import { Button } from './Button';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-cyber-dark via-cyber-slate to-slate-900 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-cyber-indigo/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyber-cyan/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full animate-[spin_60s_linear_infinite]"></div>
      </div>

      <div className="z-10 text-center space-y-8 px-6 max-w-2xl mt-12">
        <div className="space-y-2">
          <div className="inline-block px-3 py-1 border border-cyber-neon/30 rounded-full bg-cyber-neon/5 mb-4 animate-pulse">
            <span className="text-xs font-mono text-cyber-neon tracking-widest">SYSTEM STATUS: ONLINE</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyber-cyan to-cyber-indigo tracking-tight pb-2">
            Lumiere
          </h1>
          <p className="text-cyber-neon font-mono text-sm tracking-[0.3em] uppercase opacity-80">
            Socratic Learning Engine v2.5
          </p>
        </div>

        <p className="text-slate-300 font-light text-lg md:text-xl leading-relaxed max-w-lg mx-auto">
          Master the process, not just the answer. 
          <br/>
          Point your camera at your math work. 
          <br/>
          Get intelligent guidance to unstuck your logic.
        </p>

        <div className="pt-8 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyber-cyan to-cyber-indigo rounded opacity-25 group-hover:opacity-75 blur transition duration-1000 group-hover:duration-200"></div>
          <Button onClick={onStart} className="relative text-xl px-12 py-5 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
            Start Session
          </Button>
        </div>
      </div>

      <footer className="absolute bottom-6 text-slate-500 text-xs font-mono w-full text-center">
        POWERED BY GEMINI 3.0 PRO
      </footer>
    </div>
  );
};