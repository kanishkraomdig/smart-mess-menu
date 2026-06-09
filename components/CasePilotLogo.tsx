
import React from 'react';

export const CasePilotLogo: React.FC<{ className?: string }> = ({ className = "h-11 w-11" }) => {
  return (
    <div className={`${className} relative group flex items-center justify-center`}>
      {/* Background Container */}
      <div className="absolute inset-0 bg-indigo-50 rounded-2xl shadow-inner border border-indigo-100/50 group-hover:bg-indigo-100 transition-colors duration-500"></div>
      
      {/* SVG Icon */}
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-7 h-7"
      >
        {/* Paper Plane Main Wing (Pilot) */}
        <path 
          d="M20 50L85 20L55 85L45 55L20 50Z" 
          fill="url(#pilotGradient)" 
          className="drop-shadow-[0_2px_4px_rgba(67,56,202,0.2)]"
        />
        
        {/* Data Trail (AI) */}
        <circle cx="35" cy="65" r="8" fill="#4338ca" className="animate-pulse opacity-40" />
        <path 
          d="M35 65L48 58" 
          stroke="#4338ca" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeDasharray="1 6"
        />

        {/* Shimmer Overlay */}
        <rect x="0" y="0" width="100" height="100" fill="url(#shimmerGradient)" className="mix-blend-overlay">
          <animate 
            attributeName="x" 
            from="-100" 
            to="100" 
            dur="4s" 
            repeatCount="indefinite" 
          />
        </rect>

        <defs>
          <linearGradient id="pilotGradient" x1="20" y1="50" x2="85" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4338ca" />
            <stop offset="1" stopColor="#f97316" />
          </linearGradient>
          
          <linearGradient id="shimmerGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="white" stopOpacity="0" />
            <stop offset="0.5" stopColor="white" stopOpacity="0.8" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
