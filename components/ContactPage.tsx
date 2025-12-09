import React from 'react';
import { Button } from './Button';

// Fixed Contact Page with proper scrolling and no clipped content
export const ContactPage: React.FC = () => {
  return (
    <div className="h-full w-full pt-28 pb-12 px-4 overflow-y-auto custom-scrollbar">
      <div className="max-w-lg mx-auto bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-lg relative overflow-hidden animate-in zoom-in-95 duration-500 shadow-2xl mb-12">
        {/* Background Gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-indigo/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Initialize Comms</h2>
        <p className="text-slate-400 mb-8 text-sm leading-relaxed">
          Feedback, bug reports, or feature requests. <br />Frequency channel is open.
        </p>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-xs font-mono text-cyber-cyan uppercase tracking-widest">Identifier</label>
            <input
              type="text"
              className="w-full bg-black/50 border border-white/10 rounded-sm p-3 text-white focus:border-cyber-neon focus:outline-none transition-colors placeholder-white/20 font-mono text-sm"
              placeholder="YOUR_NAME"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-cyber-cyan uppercase tracking-widest">Frequency (Email)</label>
            <input
              type="email"
              className="w-full bg-black/50 border border-white/10 rounded-sm p-3 text-white focus:border-cyber-neon focus:outline-none transition-colors placeholder-white/20 font-mono text-sm"
              placeholder="user@domain.net"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-cyber-cyan uppercase tracking-widest">Transmission</label>
            <textarea
              rows={5}
              className="w-full bg-black/50 border border-white/10 rounded-sm p-3 text-white focus:border-cyber-neon focus:outline-none transition-colors resize-none placeholder-white/20 font-mono text-sm"
              placeholder="Enter message content..."
            ></textarea>
          </div>

          <Button className="w-full shadow-lg">SEND_TRANSMISSION</Button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">
            Secure Channel // End-to-End Encrypted
          </p>
        </div>
      </div>
    </div>
  );
};
