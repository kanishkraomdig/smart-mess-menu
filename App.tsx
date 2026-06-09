
import React, { useState, useEffect, useMemo } from 'react';
import { DEFAULT_MENU, DEFAULT_FACILITIES, PROJECTS } from './constants';
import { WeekMenu, Meal, Facility, Project } from './types';
import { MealCard } from './components/MealCard';
import { Gatekeeper } from './components/Gatekeeper';
import { FacilityCard } from './components/FacilityCard';
import { ImageModal } from './components/ImageModal';
import { CasePilotLogo } from './components/CasePilotLogo';
import posthog from 'posthog-js';
import { safeLocalStorage, safeSessionStorage } from './safeStorage';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function App() {
  // --- AUTHENTICATION STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [dismissedProjects, setDismissedProjects] = useState<string[]>([]);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  useEffect(() => {
    try {
      const authLocal = safeLocalStorage.getItem('campusbite_auth');
      const authSession = safeSessionStorage.getItem('campusbite_auth');
      const savedDismissed = safeLocalStorage.getItem('campussync_dismissed_projects');
      
      if (authLocal === 'true' || authSession === 'true') {
        setIsAuthenticated(true);
        posthog.capture('session_resumed', { 
          persistence: authLocal === 'true' ? 'localStorage' : 'sessionStorage' 
        });
      }
      if (savedDismissed) {
        try {
          setDismissedProjects(JSON.parse(savedDismissed));
        } catch (jsonErr) {
          console.warn("Failed to parse dismissed projects:", jsonErr);
        }
      }
    } catch (err) {
      console.error("Critical error in auth storage check:", err);
    } finally {
      setIsAuthChecking(false);
    }
  }, []);

  const [menuData] = useState<WeekMenu>(DEFAULT_MENU);
  const [facilities] = useState<Facility[]>(DEFAULT_FACILITIES);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  
  const [realTime, setRealTime] = useState<Date>(new Date());
  const currentTime = realTime;

  const [currentDayIndex, setCurrentDayIndex] = useState<number>(currentTime.getDay());
  const [isVegOnly, setIsVegOnly] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => setRealTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const mealStatus = useMemo(() => {
    const effectiveDayIndex = currentTime.getDay();
    if (currentDayIndex !== effectiveDayIndex) return null;

    const currentDayName = daysOfWeek[effectiveDayIndex];
    const dayData = menuData.days.find(d => d.day === currentDayName);
    if (!dayData) return null;

    const getMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const meals: Meal[] = [
      dayData.meals.Breakfast,
      dayData.meals.Lunch,
      dayData.meals.Snacks,
      dayData.meals.Dinner
    ];

    let currentMeal: Meal | null = null;
    let nextMeal: Meal | null = null;
    let label = '';

    for (let i = 0; i < meals.length; i++) {
      const m = meals[i];
      const start = getMinutes(m.startTime);
      const end = getMinutes(m.endTime);

      if (currentMinutes >= start && currentMinutes < end) {
        currentMeal = m;
        label = `Happening Now: ${m.type}`;
        nextMeal = meals[i + 1] || null; 
        break;
      }

      if (currentMinutes < start) {
        nextMeal = m;
        label = `Coming Up: ${m.type}`;
        break;
      }
    }

    if (!currentMeal && !nextMeal) {
        const nextDayIndex = (effectiveDayIndex + 1) % 7;
        const nextDayName = daysOfWeek[nextDayIndex];
        const nextDayData = menuData.days.find(d => d.day === nextDayName);
        if (nextDayData) {
            nextMeal = nextDayData.meals.Breakfast;
            label = `Tomorrow Morning: Breakfast`;
        }
    }

    return { currentMeal, nextMeal, label };
  }, [menuData, currentDayIndex, currentTime]);

  // --- ANALYTICS HANDLERS ---
  const handleDayChange = (idx: number) => {
    setCurrentDayIndex(idx);
    posthog.capture('day_navigated', { 
      target_day: daysOfWeek[idx],
      is_current_actual_day: idx === currentTime.getDay()
    });
  };

  const handleVegToggle = (val: boolean) => {
    setIsVegOnly(val);
    posthog.capture('dietary_filter_toggled', { 
      is_veg_only: val 
    });
  };

  const handleFacilityClick = (fac: Facility, isOpen: boolean) => {
    setSelectedFacility(fac);
    posthog.capture('facility_modal_viewed', { 
      facility_id: fac.id,
      facility_name: fac.name,
      is_currently_open: isOpen
    });
  };

  const handleDismissProject = (id: string) => {
    const updated = [...dismissedProjects, id];
    setDismissedProjects(updated);
    safeLocalStorage.setItem('campussync_dismissed_projects', JSON.stringify(updated));
    posthog.capture('project_archived', { project_id: id });
  };

  const handleCopyPin = (pin: string, projectId: string) => {
    navigator.clipboard.writeText(pin);
    setCopyFeedback(projectId);
    setTimeout(() => setCopyFeedback(null), 2000);
    posthog.capture('project_pin_copied', { 
      project_id: projectId,
      location: dismissedProjects.includes(projectId) ? 'footer' : 'main_feed'
    });
  };

  const handleProjectLaunch = (proj: Project) => {
    posthog.capture('project_launched', { 
      project_id: proj.id,
      project_name: proj.name,
      launch_context: dismissedProjects.includes(proj.id) ? 'archived' : 'active'
    });
  };

  const isViewingToday = currentDayIndex === currentTime.getDay();

  if (isAuthChecking) return null;

  if (!isAuthenticated) {
    return <Gatekeeper onAuthenticated={(rememberMe) => {
      setIsAuthenticated(true);
      posthog.capture('app_unlocked', { 
        remember_me: rememberMe,
        login_time: new Date().toISOString()
      });
    }} />;
  }

  const activeProjects = PROJECTS.filter(p => !dismissedProjects.includes(p.id));
  const footerProjects = PROJECTS.filter(p => dismissedProjects.includes(p.id));

  return (
    <div className="min-h-screen pb-32 max-w-md mx-auto bg-stone-50 shadow-2xl relative selection:bg-orange-100">
      <header className="sticky top-0 z-30 px-5 py-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] backdrop-blur-xl bg-white/85 border-b border-gray-100 transition-all duration-300">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter text-gray-900 leading-none text-balance">
              Campus<span className="text-orange-600">Sync</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {daysOfWeek[currentDayIndex]}
              </span>
              {isViewingToday && (
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse shadow-sm shadow-orange-200"></span>
              )}
            </div>
          </div>
          
          <div className="flex bg-gray-100/80 p-1 rounded-lg border border-gray-100">
             <button
                onClick={() => handleVegToggle(false)}
                className={`px-3 py-1 rounded-[6px] text-[10px] font-bold transition-all duration-200 ${!isVegOnly ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
             >
                ALL
             </button>
             <button
                onClick={() => handleVegToggle(true)}
                className={`px-3 py-1 rounded-[6px] text-[10px] font-bold transition-all duration-200 flex items-center gap-1.5 ${isVegOnly ? 'bg-green-50 text-green-700 shadow-sm ring-1 ring-green-100' : 'text-gray-400 hover:text-gray-600'}`}
             >
                <div className={`h-1.5 w-1.5 rounded-full ${isVegOnly ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                VEG
             </button>
          </div>
        </div>
      </header>

      <main className="p-5 space-y-8">
        {/* Dynamic Contextual View */}
        {mealStatus && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 pl-1">
              <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></div>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{mealStatus.label}</h2>
            </div>
            
            {mealStatus.currentMeal && (
              <MealCard meal={mealStatus.currentMeal} isHero={true} isVegOnly={isVegOnly} />
            )}

            {mealStatus.nextMeal && (
               <>
                {!mealStatus.currentMeal && (
                  <MealCard meal={mealStatus.nextMeal} isHero={true} isVegOnly={isVegOnly} title={`Next up: ${mealStatus.nextMeal.type}`} />
                )}
                {mealStatus.currentMeal && (
                    <div className="mt-6 opacity-90 scale-[0.98] origin-top transition-transform">
                         <div className="flex items-center gap-2 mb-3 ml-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-gray-300"></div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Coming Next</span>
                         </div>
                        <MealCard meal={mealStatus.nextMeal} isVegOnly={isVegOnly} />
                    </div>
                )}
               </>
            )}
          </div>
        )}

        {/* Campus Services Tray */}
        <div className="pt-2">
           <div className="flex items-center gap-3 mb-4">
             <span className="text-xl">🏛️</span>
             <h3 className="text-lg font-bold text-gray-800 tracking-tight">Campus Services</h3>
             <div className="h-px bg-gray-100 flex-grow"></div>
           </div>
           
           <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
              {facilities.map((f) => (
                <FacilityCard 
                  key={f.id} 
                  facility={f} 
                  currentTime={currentTime}
                  onClick={handleFacilityClick} 
                />
              ))}
           </div>
        </div>

        {/* Digital Initiatives Section (Active) */}
        {activeProjects.length > 0 && (
          <div className="pt-2 animate-fade-in">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <span className="text-xl">✨</span>
                <h3 className="text-lg font-bold text-gray-800 tracking-tight">Other Projects</h3>
              </div>
              <div className="h-px bg-gray-100 flex-grow ml-4"></div>
            </div>
            
            <div className="space-y-5">
              {activeProjects.map((proj) => (
                <div key={proj.id} className={`relative overflow-hidden bg-white rounded-3xl border border-gray-100 shadow-xl shadow-indigo-900/5 transition-all duration-300`}>
                  {/* Slim Accent Top Bar */}
                  <div className={`absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r ${proj.color}`}></div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <CasePilotLogo className="h-12 w-12" />
                        <div>
                          <h4 className="text-[18px] font-black text-gray-900 leading-none tracking-tight">
                            {proj.name.split(' ')[0]} <span className="text-indigo-600">{proj.name.split(' ')[1]}</span>
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                              Beta Version
                            </p>
                            {proj.id === 'casepilot' && (
                              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-[9px] font-black text-slate-500 uppercase tracking-wider">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                  <path d="M4 3a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 2v6H4V5h12zm-9 9a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1v-1a1 1 0 00-1-1H7z" />
                                </svg>
                                Desktop Recommended
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDismissProject(proj.id)}
                        className="p-2 -mr-2 text-gray-300 hover:text-gray-500 active:scale-90 transition-all"
                        title="Dismiss to footer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <p className="text-[14px] text-gray-600 font-medium leading-relaxed mb-6">
                      {proj.description}
                    </p>

                    <div className="flex flex-col gap-3">
                        <div className="group relative flex items-center justify-between gap-3 bg-indigo-50/30 p-1.5 pl-4 rounded-2xl border border-indigo-100/50 overflow-hidden">
                           {/* Subtle grid pattern for the PIN area */}
                           <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#4338ca_1px,transparent_1px)] [background-size:10px_10px]"></div>
                           
                           <div className="flex flex-col relative z-10">
                              <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">ACCESS CODE</span>
                              <span className="text-sm font-bold text-indigo-900 tracking-[0.1em] font-mono">{proj.pin}</span>
                           </div>
                           <button 
                             onClick={() => handleCopyPin(proj.pin, proj.id)}
                             className={`px-5 py-2.5 rounded-xl text-[10px] font-black transition-all duration-300 relative z-10 ${copyFeedback === proj.id ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'bg-white text-indigo-600 shadow-sm border border-indigo-100 hover:bg-indigo-50'}`}
                           >
                              {copyFeedback === proj.id ? 'COPIED' : 'COPY'}
                           </button>
                        </div>
                        
                        <a 
                          href={proj.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={() => handleProjectLaunch(proj)}
                          className={`w-full py-4 rounded-2xl bg-gray-900 text-white font-black text-[11px] tracking-[0.15em] text-center shadow-xl shadow-gray-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group`}
                        >
                          LAUNCH PROJECT
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                        </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full Day List */}
        <div>
           <div className="flex items-center gap-3 mb-5">
             <span className="text-xl">📅</span>
             <h3 className="text-lg font-bold text-gray-800 tracking-tight">Full Menu</h3>
             <div className="h-px bg-gray-100 flex-grow"></div>
           </div>
           
           <div className="space-y-5">
              {menuData.days.find(d => d.day === daysOfWeek[currentDayIndex])?.meals && 
                 (Object.values(menuData.days.find(d => d.day === daysOfWeek[currentDayIndex])!.meals) as Meal[]).map((meal) => {
                    if (mealStatus?.currentMeal === meal || mealStatus?.nextMeal === meal) return null;
                    return <MealCard key={meal.type} meal={meal} isVegOnly={isVegOnly} />;
                 })
              }
           </div>
        </div>
        
        <footer className="text-center pt-12 pb-24 px-6 mt-12 bg-gray-50/50">
          {/* Dismissed Projects Hub - Redesigned Archive Mini Cards */}
          {footerProjects.length > 0 && (
            <div className="mb-16 animate-fade-in text-left">
                <div className="flex items-center gap-2 mb-6 px-2">
                    <span className="h-px bg-gray-200 flex-grow"></span>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Other Projects</p>
                    <span className="h-px bg-gray-200 flex-grow"></span>
                </div>
                
                <div className="space-y-6">
                   {footerProjects.map(proj => (
                     <div 
                       key={proj.id}
                       className="group relative bg-white p-5 rounded-3xl border border-gray-200/60 shadow-md transition-all duration-300"
                     >
                        <div className="flex items-center gap-3 mb-4">
                           <div className="scale-75 origin-left">
                             {proj.id === 'casepilot' ? <CasePilotLogo className="h-10 w-10" /> : <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-lg">{proj.icon}</div>}
                           </div>
                           <div>
                              <h5 className="text-[14px] font-black text-gray-900 leading-none">{proj.name}</h5>
                              <div className="flex items-center gap-2 mt-1.5">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Beta Version</p>
                                {proj.id === 'casepilot' && (
                                  <span className="text-[8px] font-black text-slate-400 flex items-center gap-0.5 border-l border-gray-200 pl-2 uppercase tracking-tight">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5">
                                      <path d="M4 3a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 2v6H4V5h12zm-9 9a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1v-1a1 1 0 00-1-1H7z" />
                                    </svg>
                                    Use on Desktop
                                  </span>
                                )}
                              </div>
                           </div>
                        </div>

                        <p className="text-[12px] text-gray-500 font-medium leading-relaxed mb-5 px-1">
                          {proj.description}
                        </p>

                        <div className="flex flex-col gap-2">
                           {/* Explicit Access Code Well */}
                           <div className="flex items-center justify-between bg-stone-100/40 px-4 py-3 rounded-2xl border border-stone-200/50">
                              <div className="flex flex-col">
                                <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-0.5">ACCESS CODE</span>
                                <span className="text-xs font-mono font-bold text-stone-700 tracking-tight">{proj.pin}</span>
                              </div>
                              <button 
                                onClick={() => handleCopyPin(proj.pin, proj.id)}
                                className={`text-[10px] font-black uppercase tracking-widest transition-all px-3 py-1.5 rounded-lg border ${copyFeedback === proj.id ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-stone-200 text-indigo-600 hover:bg-stone-50'}`}
                              >
                                {copyFeedback === proj.id ? 'COPIED' : 'COPY CODE'}
                              </button>
                           </div>

                           <a 
                             href={proj.url} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             onClick={() => handleProjectLaunch(proj)}
                             className="w-full py-3.5 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                           >
                             LAUNCH PROJECT
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                               <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                             </svg>
                           </a>
                        </div>
                     </div>
                   ))}
                </div>
            </div>
          )}

          <div className="max-w-xs mx-auto space-y-8">
            <div className="flex flex-col items-center gap-2 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                <h2 className="text-xs font-black tracking-tighter text-gray-900 leading-none">
                  Campus<span className="text-orange-600">Sync</span>
                </h2>
                <div className="h-[1px] w-6 bg-orange-600/30 rounded-full"></div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] text-gray-400 font-medium leading-relaxed px-4">
                This is an independent project created for student convenience and is not an official university platform. Please verify information at source.
              </p>
              
              <div className="space-y-2">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent w-full"></div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[10px] text-gray-400 font-medium">
                      Spotted an error? <a href="https://wa.link/gehb6y" target="_blank" rel="noopener noreferrer" onClick={() => posthog.capture('footer_contact_clicked')} className="text-orange-600 hover:text-orange-700 font-bold hover:underline transition-colors">Reach out here</a>
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      Created by <a href="https://www.linkedin.com/in/kanishkrao/" target="_blank" rel="noopener noreferrer" onClick={() => posthog.capture('footer_linkedin_clicked')} className="text-orange-600 hover:text-orange-700 font-bold hover:underline transition-colors">Kanishk Rao</a>
                    </p>
                  </div>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Modals & Overlays */}
      <ImageModal 
        facility={selectedFacility} 
        onClose={() => setSelectedFacility(null)} 
      />

      <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
        <div className="flex gap-1.5 bg-white/90 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-white/50 pointer-events-auto ring-1 ring-gray-900/5">
            {daysOfWeek.map((d, idx) => {
                const short = d.substring(0, 1);
                const isActive = idx === currentDayIndex;
                const isToday = idx === currentTime.getDay();
                
                return (
                    <button 
                        key={d}
                        onClick={() => handleDayChange(idx)}
                        className={`w-10 h-10 rounded-xl text-xs font-bold flex items-center justify-center transition-all duration-300 relative
                            ${isActive ? 'bg-gray-900 text-white shadow-lg scale-105' : 'bg-transparent text-gray-400 hover:bg-gray-100 hover:text-gray-600'}
                            ${!isActive && isToday ? 'text-orange-500 font-extrabold bg-orange-50' : ''}
                        `}
                    >
                        {short}
                        {!isActive && isToday && (
                            <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-orange-500"></span>
                        )}
                    </button>
                )
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
