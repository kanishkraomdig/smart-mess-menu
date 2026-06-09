
import React from 'react';
import { Facility, FacilityShift } from '../types';

interface FacilityCardProps {
  facility: Facility;
  onClick: (f: Facility, isOpen: boolean) => void;
  currentTime: Date;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({ facility, onClick, currentTime }) => {
  const getMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const currentDay = currentTime.getDay();

  const isDoctor = facility.id === 'doctor';
  const isGym = facility.id === 'gym';
  const isLibrary = facility.id === 'library';
  const isImageCard = isDoctor || isGym || isLibrary;

  // Determine which shifts are active right now
  const activeShifts = facility.shifts?.filter(shift => {
    const isCorrectDay = shift.activeDays.includes(currentDay);
    const start = getMinutes(shift.startTime);
    const end = getMinutes(shift.endTime);
    
    // Hide Coach tags from the card UI
    if (isGym && shift.name.includes('Coach')) return false;
    
    // Logic for shifts that wrap around midnight (e.g., 09:00 to 02:00)
    const isInside = end < start 
      ? (currentMinutes >= start || currentMinutes < end)
      : (currentMinutes >= start && currentMinutes < end);

    return isCorrectDay && isInside;
  }) || [];

  // General Open/Closed logic for standard cards (fallback if no shifts defined)
  const start = getMinutes(facility.startTime);
  const end = getMinutes(facility.endTime);
  const isCorrectDay = facility.activeDays ? facility.activeDays.includes(currentDay) : true;
  const isGeneralOpen = end < start 
    ? (currentMinutes >= start || currentMinutes < end)
    : (currentMinutes >= start && currentMinutes < end);

  const isOpen = activeShifts.length > 0 || (!facility.shifts && isCorrectDay && isGeneralOpen);

  const getTagName = (s: FacilityShift) => {
    if (isDoctor) {
      if (s.name === 'General Physician') return 'General Physician';
      if (s.name.includes('Psychologist')) return 'Psychologist';
      return s.name.split(' ')[0];
    }
    if (isGym) {
        return s.name; 
    }
    return s.name.split(' ')[0];
  };

  // Gradient colors for image headers
  let gradientClass = "from-slate-950/95 via-slate-900/40";
  if (isDoctor) gradientClass = "from-blue-900/95 via-blue-900/40";
  if (isLibrary) gradientClass = "from-amber-950/95 via-amber-900/40";

  return (
    <button
      onClick={() => onClick(facility, isOpen)}
      className={`flex-shrink-0 w-44 text-left bg-white rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-all relative overflow-hidden group hover:border-orange-100 hover:shadow-md flex flex-col`}
    >
      {isImageCard ? (
        <div className="h-24 w-full relative flex-shrink-0">
          <img 
            src={facility.imageUrl} 
            alt={facility.name}
            className="w-full h-full object-cover object-top"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass} to-transparent`}></div>
          <div className="absolute bottom-2 left-3 right-3 flex items-center gap-2">
            <div className="bg-white/95 shadow-sm rounded-lg p-1 text-gray-900 ring-1 ring-black/5">
                <span className="text-base leading-none block">{facility.icon}</span>
            </div>
            <h4 className="font-bold text-white text-[13px] leading-tight drop-shadow-sm">{facility.name}</h4>
          </div>
        </div>
      ) : (
        <div className="p-4 pb-0 flex-shrink-0">
          <div className={`h-10 w-10 ${facility.color} rounded-xl flex items-center justify-center text-xl mb-3 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
            {facility.icon}
          </div>
          <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1">{facility.name}</h4>
        </div>
      )}
      
      <div className="p-3 pt-2 flex-grow flex flex-col justify-between">
        <div className="mb-2">
            {!isImageCard && (
                <p className="text-[10px] text-gray-400 font-bold leading-tight uppercase tracking-tight mb-2">
                    {facility.timings}
                </p>
            )}
            
            <div className="flex flex-wrap gap-x-1.5 gap-y-1.5 min-h-[1.5rem]">
                {isOpen ? (
                    isLibrary ? (
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[9px] font-bold rounded-md border border-green-100 animate-in fade-in slide-in-from-bottom-1 duration-300 flex items-center whitespace-nowrap">
                            <span className="h-1 w-1 rounded-full bg-green-500 inline-block mr-1.5 animate-pulse"></span>
                            Library Open
                        </span>
                    ) : activeShifts.length > 0 ? (
                        activeShifts.map((s, i) => (
                            <span key={i} className="px-2 py-0.5 bg-green-50 text-green-700 text-[9px] font-bold rounded-md border border-green-100 animate-in fade-in slide-in-from-bottom-1 duration-300 flex items-center whitespace-nowrap">
                                <span className="h-1 w-1 rounded-full bg-green-500 inline-block mr-1.5 animate-pulse"></span>
                                {getTagName(s)}
                            </span>
                        ))
                    ) : (
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[9px] font-bold rounded-md border border-green-100 flex items-center">
                            <span className="h-1 w-1 rounded-full bg-green-500 inline-block mr-1.5 animate-pulse"></span>
                            Open Now
                        </span>
                    )
                ) : (
                    isImageCard ? (
                        <span className="text-[10px] font-medium text-gray-400 tracking-tight italic py-1">
                           {isGym ? "Closed for Cleaning" : isLibrary ? "Library Closed" : "No doctor available"}
                        </span>
                    ) : (
                        <span className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[9px] font-bold rounded-md border border-gray-100">
                            Closed Now
                        </span>
                    )
                )}
            </div>
        </div>

        {isImageCard && (
            <div className="mt-auto border-t border-gray-100 pt-2 flex items-center justify-between">
                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-tighter">Full Schedule</span>
                <div className="bg-blue-50 p-1 rounded-md group-hover:bg-blue-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-2.5 h-2.5 text-blue-500 group-hover:text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
            </div>
        )}
      </div>
    </button>
  );
};
