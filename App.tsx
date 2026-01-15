import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { UserRole, Language } from './types';
import ParentDashboard from './components/ParentDashboard';
import WorkerDashboard from './components/WorkerDashboard';
import { TRANSLATIONS } from './constants';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [language, setLanguage] = useState<Language>('en');

  // Check for API Key in URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get('key') || params.get('apiKey');
    if (key) {
      localStorage.setItem('GEMINI_API_KEY', key);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Optional: Reload to clear state if needed, though dynamic service handles it
      // window.location.reload();
    }
  }, []);

  // Login Selection Screen
  if (!role) {
    const t = TRANSLATIONS[language];
    return (
      <>
        <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center p-6">
        <div className="mb-8 flex flex-col items-center">
          <div className="w-20 h-20 bg-brand-500 rounded-full flex items-center justify-center text-4xl mb-4 shadow-lg text-white">
            🍲
          </div>
          <h1 className="text-3xl font-bold text-gray-800">PoshanPath</h1>
          <p className="text-gray-600">Nutrition for every child</p>
        </div>

        {/* Language Toggle */}
        <div className="flex bg-white rounded-full p-1 shadow-sm mb-8 border border-brand-100">
           <button 
             onClick={() => setLanguage('en')}
             className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${language === 'en' ? 'bg-brand-500 text-white shadow-md' : 'text-gray-500'}`}
           >
             English
           </button>
           <button 
             onClick={() => setLanguage('hi')}
             className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${language === 'hi' ? 'bg-brand-500 text-white shadow-md' : 'text-gray-500'}`}
           >
             हिंदी / Hinglish
           </button>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">{t.selectRole}</h2>
          
          <button 
            onClick={() => setRole('parent')}
            className="w-full bg-white p-4 rounded-xl shadow-md border-2 border-transparent hover:border-brand-500 transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              👨‍👩‍👧
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-800">{t.parent}</div>
              <div className="text-xs text-gray-500">Track your child's nutrition</div>
            </div>
          </button>

          <button 
            onClick={() => setRole('worker')}
            className="w-full bg-white p-4 rounded-xl shadow-md border-2 border-transparent hover:border-brand-500 transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              👩‍⚕️
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-800">{t.worker}</div>
              <div className="text-xs text-gray-500">Manage catchment area</div>
            </div>
          </button>
        </div>
      </div>
      <Analytics />
    </>
    );
  }

  // Role Based Rendering
  return (
    <>
      <div className="h-[100dvh] w-full bg-gray-100 flex items-center justify-center">
        <div className="h-full w-full max-w-md bg-gray-50 text-gray-900 font-sans shadow-2xl overflow-hidden relative flex flex-col">
            <button 
              onClick={() => setRole(null)} 
              className="absolute top-4 right-4 text-xs bg-white/80 backdrop-blur-sm border border-gray-200 px-2 py-1 rounded hover:bg-white z-50 shadow-sm"
            >
              Logout
            </button>
            
            <div className="flex-1 w-full overflow-hidden flex flex-col">
              {role === 'parent' ? (
                <ParentDashboard language={language} />
              ) : (
                <WorkerDashboard language={language} />
              )}
            </div>
        </div>
      </div>
      <Analytics />
    </>
  );
};

export default App;