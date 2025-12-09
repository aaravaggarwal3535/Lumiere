import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CameraViewProps, Message } from '../types';
import { Button } from './Button';
import { ReasoningTerminal } from './ReasoningTerminal';
import { TeachingOverlay } from './TeachingOverlay';
import { Waveform } from './Waveform';
import { startMathSession, sendChatMessage, getMathExample, ChatSession } from '../services/geminiService';

// Type definition for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export const CameraView: React.FC<CameraViewProps> = ({ onBack }) => {
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  
  // State
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  
  // UI State
  const [mode, setMode] = useState<'camera' | 'analyzing' | 'chat'>('camera');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Teaching Mode State
  const [isExampleOpen, setIsExampleOpen] = useState(false);
  const [exampleContent, setExampleContent] = useState<string | null>(null);

  // Initialize Camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera Error:", err);
        setError("Camera access required for vision analysis.");
      }
    };

    if (mode === 'camera') {
      startCamera();
    } else if (stream) {
      // Stop camera stream when not in camera mode to save battery
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  // Text cleanup helper
  const cleanText = (text: string) => {
    // Removes dollar signs and ensures text is clean
    return text.replace(/\$+/g, '').replace(/\\/g, '');
  };

  // Text-to-Speech
  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    // Clean text for speech to avoid reading symbols
    const spokenText = text.replace(/\$+/g, '').replace(/[*_]/g, '');

    const utterance = new SpeechSynthesisUtterance(spokenText);
    const voices = window.speechSynthesis.getVoices();
    // Prioritize specific voices for the persona
    const voice = voices.find(v => v.name.includes('Google UK English Male')) || 
                  voices.find(v => v.name.includes('Google US English')) ||
                  voices[0];
    
    if (voice) utterance.voice = voice;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  // Handle "Show Example" Trigger
  const handleShowExample = async () => {
    if (!chatSession) return;
    
    setIsProcessing(true);
    try {
      const example = await getMathExample(chatSession.chat);
      setExampleContent(example);
      setIsExampleOpen(true);
      speak("Here is a similar example for you to study.");
    } catch (err) {
      console.error("Failed to get example", err);
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: 'model',
        text: "I couldn't generate an example right now.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
      speak("I couldn't generate an example right now.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Capture & Analyze
  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      setMode('analyzing');
      setIsProcessing(true);
      
      // Capture frame
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Canvas context failed");
      
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      const base64 = dataUrl.split(',')[1];
      
      setCapturedImage(dataUrl); // Keep full URL for display

      // Send to API
      const session = await startMathSession(base64);
      setChatSession(session);
      
      const initialMessage: Message = {
        id: Date.now().toString(),
        role: 'model',
        text: session.initialResponse,
        timestamp: Date.now()
      };
      
      setMessages([initialMessage]);
      setMode('chat');
      setIsProcessing(false);
      speak(session.initialResponse);

    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please try again.");
      setMode('camera');
      setIsProcessing(false);
    }
  };

  // Voice Input Logic
  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      
      recognition.onresult = async (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (!transcript) {
          console.warn("No transcript received");
          return;
        }

        console.log("User said:", transcript);

        // Detect "Example" keyword
        if (transcript.toLowerCase().includes('example')) {
          setIsListening(false);
          handleShowExample();
          return;
        }

        // Add user message immediately
        const userMsg: Message = {
          id: Date.now().toString(),
          role: 'user',
          text: transcript,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, userMsg]);
        setIsListening(false);
        setIsProcessing(true); // Start "Terminal" effect

        // Send to Gemini
        if (chatSession) {
          try {
            const responseText = await sendChatMessage(chatSession.chat, transcript);
            
            const modelMsg: Message = {
              id: (Date.now() + 1).toString(),
              role: 'model',
              text: responseText,
              timestamp: Date.now()
            };
            setMessages(prev => [...prev, modelMsg]);
            setIsProcessing(false); // Stop "Terminal" effect
            speak(responseText);
          } catch (err) {
            console.error("Chat API Error", err);
            const errorMsg: Message = {
              id: Date.now().toString(),
              role: 'model',
              text: "I'm having trouble connecting. Could you say that again?",
              timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMsg]);
            setIsProcessing(false);
          }
        } else {
          console.error("Chat session is missing");
          setIsProcessing(false);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert("Microphone access blocked. Please allow permissions.");
        }
      };

      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      console.error("Failed to start speech recognition", e);
      setIsListening(false);
    }
  }, [chatSession, speak]);

  // --- RENDER ---

  if (mode === 'camera' || mode === 'analyzing') {
    return (
      <div className="relative w-full h-full bg-black flex flex-col font-mono">
        {/* Hidden Canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Live Feed with Scanlines */}
        <div className="flex-grow relative overflow-hidden group">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          
          {/* Scanline Overlay */}
          <div className="scanline-bar"></div>
          
          {/* HUD Grid */}
          <div className="absolute inset-0 pointer-events-none">
             {/* Corners */}
             <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyber-neon/50"></div>
             <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyber-neon/50"></div>
             <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyber-neon/50"></div>
             <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyber-neon/50"></div>
             
             {/* Center Reticle */}
             <div className="absolute top-1/2 left-1/2 w-64 h-64 border border-cyber-neon/20 transform -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-cyber-neon rounded-full opacity-50"></div>
             </div>
          </div>

          {/* Reasoning Terminal (Loading State) */}
          {isProcessing && <ReasoningTerminal />}

          {error && (
             <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
               <div className="p-6 bg-red-900/50 border border-red-500 rounded text-center backdrop-blur-sm">
                 <p className="text-white mb-4">{error}</p>
                 <Button onClick={() => setMode('camera')} variant="secondary">RETRY_CONNECTION</Button>
               </div>
             </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="p-6 bg-black/80 backdrop-blur-lg border-t border-white/10 flex justify-between items-center z-20">
           {/* Placeholder for left space */}
           <div className="w-10"></div>
           
           <Button onClick={handleCapture} disabled={isProcessing} className="shadow-[0_0_30px_rgba(0,255,157,0.2)]">
             SNAP_&_ANALYZE
           </Button>
           
           <div className="w-10"></div>
        </div>
      </div>
    );
  }

  // Chat Mode
  return (
    <div className="flex flex-col h-full bg-cyber-dark text-white font-mono relative overflow-hidden">
      
      {/* Background Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-scanlines z-0"></div>

      {/* Teaching Overlay (Slides in) */}
      {isExampleOpen && exampleContent && (
        <TeachingOverlay content={exampleContent} onClose={() => setIsExampleOpen(false)} />
      )}

      {/* Reasoning Terminal (Floating Overlay during voice chat) */}
      {isProcessing && <ReasoningTerminal />}

      {/* Top: Frozen Image */}
      <div className="relative h-1/4 bg-black border-b border-white/10 flex-shrink-0 z-10">
        <img 
          src={capturedImage || ''} 
          alt="Analysis Target" 
          className="w-full h-full object-contain opacity-60 grayscale hover:grayscale-0 transition-all duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark to-transparent"></div>
        
        <button 
          onClick={onBack} 
          className="absolute top-4 left-4 bg-black/40 hover:bg-black/80 text-white rounded-full p-2 backdrop-blur-md transition-all border border-white/10 z-50"
        >
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
           </svg>
        </button>
        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-cyber-neon/10 border border-cyber-neon/30 rounded text-[10px] text-cyber-neon tracking-widest">
           TARGET_LOCKED
        </div>
      </div>

      {/* Middle: Chat History */}
      <div 
        ref={chatScrollRef}
        className="flex-grow overflow-y-auto p-4 space-y-6 custom-scrollbar z-10 scroll-smooth"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-xl px-5 py-4 text-sm leading-relaxed backdrop-blur-md border shadow-lg transition-all duration-500 ${
                msg.role === 'user' 
                  ? 'bg-white/5 border-white/10 text-white rounded-br-none' 
                  : 'bg-black/40 border-cyber-neon/20 text-cyan-50 rounded-bl-none shadow-[0_0_15px_rgba(0,255,157,0.05)]'
              }`}
            >
              {msg.role === 'model' && (
                <div className="flex items-center gap-2 mb-2 opacity-50">
                   <div className="w-1.5 h-1.5 bg-cyber-neon rounded-full"></div>
                   <span className="text-[10px] uppercase tracking-widest text-cyber-neon">Lumiere AI</span>
                </div>
              )}
              {/* Plain Text Rendering */}
              {cleanText(msg.text)}
            </div>
          </div>
        ))}
        {/* Invisible spacer for scrolling */}
        <div className="h-8"></div>
      </div>

      {/* Bottom: Voice Interface */}
      <div className="p-8 bg-black/60 backdrop-blur-xl border-t border-white/10 flex flex-col items-center justify-center relative z-20">
         
         {/* Show Example Button */}
         <button 
           onClick={handleShowExample}
           disabled={isProcessing}
           className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-1 group"
         >
            <div className="w-10 h-10 rounded-full bg-blue-900/40 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-800 transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-blue-400 opacity-60 group-hover:opacity-100">Example</span>
         </button>

         <button 
           onClick={startListening}
           disabled={isListening || isSpeaking || isProcessing}
           className={`
             group relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500
             ${isListening 
               ? 'bg-red-500/80 shadow-[0_0_50px_rgba(239,68,68,0.4)] scale-110 border border-red-400' 
               : isSpeaking
                 ? 'bg-indigo-500/20 border border-indigo-500/50 cursor-wait animate-pulse'
                 : 'bg-cyber-neon/10 border border-cyber-neon/50 shadow-[0_0_30px_rgba(0,255,157,0.15)] hover:bg-cyber-neon/20 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,255,157,0.3)]'
             }
           `}
         >
           {/* Mic Icon */}
           <svg 
             className={`w-8 h-8 transition-all duration-300 ${isListening ? 'text-white' : 'text-cyber-neon'}`} 
             fill="none" 
             viewBox="0 0 24 24" 
             stroke="currentColor"
           >
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
           </svg>
           
           {/* Rings */}
           {!isListening && !isSpeaking && (
             <>
               <span className="absolute inset-0 rounded-full border border-cyber-neon/20 animate-ping opacity-20 delay-75"></span>
               <span className="absolute -inset-2 rounded-full border border-cyber-neon/10 opacity-20"></span>
             </>
           )}
         </button>

         <div className="mt-6">
           <Waveform isSpeaking={isSpeaking} />
         </div>
      </div>
    </div>
  );
};