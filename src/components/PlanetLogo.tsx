import React from 'react';

export const PlanetLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`${className} select-none`} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Planet sphere gradient */}
        <linearGradient id="planetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" /> {/* brand-violet */}
          <stop offset="50%" stopColor="#3B82F6" /> {/* brand-royal */}
          <stop offset="100%" stopColor="#06B6D4" /> {/* teal */}
        </linearGradient>
        
        {/* Orbital ring gradient */}
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#06B6D4" stopOpacity="1" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Sparkles / Stars */}
      {/* Sparkle top right */}
      <path d="M72 15 L74 21 L80 23 L74 25 L72 31 L70 25 L64 23 L70 21 Z" fill="#F59E0B" />
      {/* Sparkle bottom left */}
      <path d="M22 68 L23.5 72.5 L28 74 L23.5 75.5 L22 80 L20.5 75.5 L16 74 L20.5 72.5 Z" fill="#F59E0B" />
      {/* Tiny star top left */}
      <circle cx="20" cy="30" r="1.5" fill="#7C3AED" />
      <circle cx="82" cy="62" r="1" fill="#06B6D4" />

      {/* Back orbital ring (behind the planet) */}
      <path 
        d="M12 58 C15 46, 85 38, 88 50" 
        stroke="url(#ringGrad)" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
      />

      {/* Planet Sphere Core */}
      <circle cx="50" cy="50" r="26" fill="url(#planetGrad)" className="drop-shadow-lg" />
      
      {/* Elegant white 'e' inside the planet core */}
      <path 
        d="M50 35 C41.5 35, 35 41.5, 35 50 C35 58.5, 41.5 65, 50 65 C56.5 65, 62 60.5, 63.8 54 L56.2 54 C55 57, 52.5 58.5, 50 58.5 C45.5 58.5, 42 55, 42 50 L64.5 50 C64.5 49.2, 64.5 48.5, 64.5 47.5 C64.5 40.5, 58 35, 50 35 Z M42 44.5 C43 41, 46.2 39.5, 50 39.5 C53.8 39.5, 56.5 41, 57.5 44.5 Z" 
        fill="white" 
      />

      {/* Front orbital ring (in front of the planet to complete 3D overlap) */}
      <path 
        d="M88 50 C85 62, 15 70, 12 58" 
        stroke="url(#ringGrad)" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
      />
    </svg>
  );
};
