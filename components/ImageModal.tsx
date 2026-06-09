
import React from 'react';
import { Facility } from '../types';

interface ImageModalProps {
  facility: Facility | null;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ facility, onClose }) => {
  if (!facility) return null;

  const formatActiveDays = (days: number[]) => {
    if (days.length === 7) return 'Daily';
    if (days.length === 6 && !days.includes(0)) return 'Mon - Sat';
    if (days.length === 5 && days.every(d => d >= 1 && d <= 5)) return 'Mon - Fri';
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map(d => dayNames[d]).join(', ');
  };

  const isDoctor = facility.id === 'doctor';
  const isGym = facility.id === 'gym';
  const isLibrary = facility.id === 'library';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{facility.icon}</span>
            <div>
              <h3 className="font-bold text-gray-900 leading-tight">{facility.name}</h3>
              <p className="text-xs text-gray-500">{facility.timings}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 active:scale-90 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-2 bg-gray-50 overflow-auto max-h-[75vh]">
          {facility.shifts && facility.shifts.length > 0 && (
            <div className="p-4 bg-white m-2 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                    {isDoctor ? 'Consultation Details' : 'Service Details'}
                </h4>
                <div className="space-y-4">
                    {facility.shifts.map((shift, idx) => (
                        <div key={idx} className="flex justify-between items-start border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                            <div className="max-w-[55%]">
                                <p className="font-bold text-gray-800 text-sm leading-tight">{shift.name}</p>
                                <p className="text-[10px] text-gray-500 mt-1 font-medium">
                                    {formatActiveDays(shift.activeDays)}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold border ${shift.name.includes('Coach') ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                    {shift.displayTime}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          )}

          <div className="p-2">
            <img 
                src={facility.imageUrl} 
                alt={`${facility.name} schedule`} 
                className="w-full rounded-xl shadow-inner border border-gray-200"
                loading="lazy"
            />
          </div>
        </div>
        
        <div className="p-5 text-center bg-white border-t border-gray-100 flex flex-col gap-2">
          {isDoctor && (
            <div className="bg-orange-50 p-2 rounded-lg border border-orange-100 group">
                <p className="text-[10px] text-orange-800 font-bold uppercase tracking-tight">
                    Emergency? Call Mr. Gautam Yadav: <a href="tel:8073155017" className="text-orange-600 underline decoration-orange-300 underline-offset-2 decoration-2 hover:text-orange-700">8073155017</a>
                </p>
            </div>
          )}
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Sourced from campus notices
          </p>
        </div>
      </div>
    </div>
  );
};
