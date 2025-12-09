import React from 'react';

interface WaveformProps {
  isSpeaking: boolean;
}

export const Waveform: React.FC<WaveformProps> = ({ isSpeaking }) => {
  // 5 bars with different animation delays to create a wave effect
  const bars = [0, 100, 200, 300, 150];

  return (
    <div className="flex items-center justify-center gap-1.5 h-8">
      {bars.map((delay, index) => (
        <div
          key={index}
          className={`w-1.5 bg-cyber-neon rounded-full shadow-[0_0_10px_rgba(0,255,157,0.8)] transition-all duration-300 ${
            isSpeaking ? 'animate-waveform' : 'h-1 opacity-30'
          }`}
          style={{
            animationDelay: `${delay}ms`,
            // If not speaking, reset height to minimum via style override or relying on class
            height: isSpeaking ? undefined : '4px'
          }}
        ></div>
      ))}
    </div>
  );
};