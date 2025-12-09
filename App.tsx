import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { CameraView } from './components/CameraView';
import { AppView } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);

  // Function to render the active view
  const renderView = () => {
    switch (currentView) {
      case AppView.HOME:
        return <LandingPage onStart={() => setCurrentView(AppView.SESSION)} />;
      case AppView.ABOUT:
        return <AboutPage />;
      case AppView.CONTACT:
        return <ContactPage />;
      case AppView.SESSION:
        // CameraView handles its own full-screen layout
        return <CameraView onBack={() => setCurrentView(AppView.HOME)} />;
      default:
        return <LandingPage onStart={() => setCurrentView(AppView.SESSION)} />;
    }
  };

  return (
    <div className="h-screen w-screen bg-cyber-dark text-white overflow-hidden flex flex-col font-sans">
      
      {/* Background Effect (Global) */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-scanlines z-0"></div>

      {/* Show Navbar on all pages EXCEPT Session */}
      {currentView !== AppView.SESSION && (
        <Navbar currentView={currentView} onNavigate={setCurrentView} />
      )}

      {/* Main Content Area */}
      <main className="flex-grow relative z-10 overflow-hidden">
        {renderView()}
      </main>

    </div>
  );
};

export default App;