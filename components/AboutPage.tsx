import React from 'react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 px-6 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            The <span className="text-cyber-cyan">Socratic</span> Engine
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Lumiere is not a calculator. It is a thinking partner designed to help you master the process of mathematical reasoning.
          </p>
        </section>

        {/* Philosophy Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 bg-white/5 border border-white/10 rounded-lg hover:border-cyber-neon/50 transition-colors duration-300 group">
            <div className="w-12 h-12 bg-cyber-indigo/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-cyber-indigo/30 transition-colors">
              <svg className="w-6 h-6 text-cyber-indigo" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Vision Analysis</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Powered by Gemini 3.0 Pro, Lumiere sees your handwritten work in real-time. It understands the context of your problem without needing manual input.
            </p>
          </div>

          <div className="p-8 bg-white/5 border border-white/10 rounded-lg hover:border-cyber-cyan/50 transition-colors duration-300 group">
            <div className="w-12 h-12 bg-cyber-cyan/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-cyber-cyan/30 transition-colors">
              <svg className="w-6 h-6 text-cyber-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Socratic Dialogue</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Instead of giving answers, Lumiere asks the right questions. It guides you to find the solution yourself, reinforcing neural pathways for long-term retention.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <section className="border-t border-white/10 pt-16">
          <h2 className="text-2xl font-bold text-white mb-8">System Architecture</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['React 18', 'Tailwind CSS', 'Google Gemini', 'Web Speech API'].map((tech) => (
              <div key={tech} className="p-4 bg-black border border-white/5 text-center hover:bg-white/5 transition-colors">
                <span className="font-mono text-xs text-cyber-neon uppercase tracking-widest">{tech}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};