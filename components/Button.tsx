import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "relative overflow-hidden font-mono font-bold uppercase tracking-widest transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-cyber-indigo hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)] border border-cyber-cyan/30 py-4 px-8 rounded-sm clip-path-polygon",
    secondary: "bg-cyber-slate/80 hover:bg-cyber-slate text-cyber-cyan border border-cyber-cyan/50 py-3 px-6 rounded-sm backdrop-blur-md",
    danger: "bg-red-900/80 hover:bg-red-800 text-red-200 border border-red-500/50 py-3 px-6 rounded-sm"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          PROCESSING_
        </span>
      ) : (
        children
      )}
      
      {/* Aesthetic corner accents */}
      {variant === 'primary' && (
        <>
          <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white opacity-50"></span>
          <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white opacity-50"></span>
        </>
      )}
    </button>
  );
};