
import React, { useState } from 'react';
import posthog from 'posthog-js';
import { safeLocalStorage, safeSessionStorage } from '../safeStorage';

interface GatekeeperProps {
  onAuthenticated: (rememberMe: boolean) => void;
}

export const Gatekeeper: React.FC<GatekeeperProps> = ({ onAuthenticated }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  const ACCESS_PIN = "1234"; 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ACCESS_PIN) {
      const val = 'true';
      if (rememberMe) {
        safeLocalStorage.setItem('campusbite_auth', val);
        safeSessionStorage.removeItem('campusbite_auth');
      } else {
        safeSessionStorage.setItem('campusbite_auth', val);
        safeLocalStorage.removeItem('campusbite_auth');
      }
      onAuthenticated(rememberMe);
    } else {
      setError('Incorrect PIN');
      setPin('');
      posthog.capture('auth_attempt_failed', { 
        attempted_pin_length: pin.length,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4 selection:bg-orange-100">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-8 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
           <span className="text-5xl mb-3 block relative z-10 shadow-sm drop-shadow-md">🔒</span>
           <h2 className="text-2xl font-bold text-white relative z-10 tracking-tight">Restricted Access</h2>
           <p className="text-orange-100 text-sm mt-1 relative z-10 font-medium">Enter PIN to view CampusSync</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label htmlFor="pin" className="sr-only">Access Code</label>
              <input
                type="password"
                id="pin"
                inputMode="numeric"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                className="block w-full text-center text-3xl font-bold tracking-[0.5em] rounded-xl border-2 border-gray-100 bg-gray-50 p-4 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:tracking-normal placeholder:font-normal placeholder:text-gray-300 text-gray-800"
                placeholder="••••"
                maxLength={4}
                autoFocus
              />
            </div>
            
            <div className="flex items-center justify-center gap-2.5">
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer select-none font-medium">
                Keep me signed in
              </label>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center font-bold animate-shake">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Unlock App
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Powered by CampusSync</p>
          </div>
        </div>
      </div>
    </div>
  );
};
