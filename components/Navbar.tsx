import React from 'react';
import { AppView } from '../types';
import { Button } from './Button';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { label: 'HOME', view: AppView.HOME },
    { label: 'ABOUT', view: AppView.ABOUT },
    { label: 'CONTACT', view: AppView.CONTACT },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <button 
          onClick={() => onNavigate(AppView.HOME)}
          className="flex items-center gap-3 group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-cyber-cyan to-cyber-indigo rounded-sm rotate-45 group-hover:rotate-90 transition-transform duration-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
          <span className="font-sans font-bold text-2xl tracking-tighter text-white">
            Lumiere<span className="text-cyber-neon">.</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.view)}
              className={`text-sm font-mono tracking-widest transition-colors duration-300 relative group ${
                currentView === item.view ? 'text-cyber-neon' : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-cyber-neon transform origin-left transition-transform duration-300 ${
                currentView === item.view ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'
              }`}></span>
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center">
          <Button 
            variant="secondary" 
            className="py-2 px-6 text-xs border-cyber-neon/30 text-cyber-neon hover:bg-cyber-neon/10"
            onClick={() => onNavigate(AppView.SESSION)}
          >
            LAUNCH_SESSION
          </Button>
        </div>
      </div>
    </nav>
  );
};