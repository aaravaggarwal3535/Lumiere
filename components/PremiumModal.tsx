import React from 'react';
import { Button } from './Button';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300 px-4">
      <div className="bg-cyber-slate/90 border border-cyber-neon/50 p-8 rounded-lg max-w-md w-full shadow-[0_0_50px_rgba(0,255,157,0.2)] relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-neon to-transparent"></div>
        
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Limitless Learning</h2>
          <p className="text-cyber-cyan font-mono text-sm uppercase tracking-widest">Upgrade to Pro</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-gray-300 p-3 bg-white/5 rounded-md border border-white/5">
            <svg className="w-5 h-5 text-cyber-neon shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            <span className="font-mono text-sm">Gemini 3.0 Reasoning Engine</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300 p-3 bg-white/5 rounded-md border border-white/5">
            <svg className="w-5 h-5 text-cyber-neon shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            <span className="font-mono text-sm">Unlimited Voice Chat</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300 p-3 bg-white/5 rounded-md border border-white/5">
            <svg className="w-5 h-5 text-cyber-neon shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            <span className="font-mono text-sm">Holographic Examples</span>
          </div>
        </div>

        <Button 
          className="w-full text-lg shadow-[0_0_20px_rgba(0,255,157,0.3)] mb-4"
          onClick={() => {
            alert("Redirecting to Stripe Checkout...");
            // In a real app, this would redirect to a Stripe payment link
          }}
        >
          Subscribe - $9.99/mo
        </Button>
        
        <button onClick={onClose} className="w-full text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
          No thanks, I'll wait for credits
        </button>
      </div>
    </div>
  );
};