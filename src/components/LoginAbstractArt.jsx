import React from 'react';

export default function LoginAbstractArt() {
  return (
    <div className="relative w-full h-full max-w-[540px] max-h-[540px] aspect-square mx-auto flex items-center justify-center select-none pointer-events-none">
      
      {/* Background ambient radial glow */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#ff6b4a]/20 via-[#ff4b72]/20 to-[#b388ff]/15 blur-[60px] opacity-80" />

      {/* Main SVG 2D Abstract Composition */}
      <svg
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-[0_15px_35px_rgba(235,59,90,0.25)] overflow-visible"
        aria-hidden="true"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="coralFlow" x1="50" y1="100" x2="520" y2="480" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ff5722" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#ff7e5f" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fca311" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="roseRibbon" x1="450" y1="80" x2="120" y2="520" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ff4081" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#ff758c" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#f48fb1" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="lavenderVeil" x1="100" y1="400" x2="480" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#b388ff" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#d1c4e9" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ede7f6" stopOpacity="0.5" />
          </linearGradient>

          <linearGradient id="creamFold" x1="200" y1="150" x2="400" y2="450" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fff8e1" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#ffe082" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffca28" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="contourGrad" x1="0" y1="0" x2="600" y2="600" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#ffab40" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
          </linearGradient>

          {/* Restrained subtle shadow filter */}
          <filter id="layerShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#880e4f" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* ======================================================== */}
        {/* Layer 1: Base Flowing Organic Contour (16s cycle)       */}
        {/* ======================================================== */}
        <g className="animate-layer-slow origin-center">
          <path
            d="M 140 240 C 90 340, 150 480, 280 500 C 410 520, 510 420, 480 290 C 450 160, 310 90, 220 130 C 160 160, 160 200, 140 240 Z"
            fill="url(#lavenderVeil)"
            filter="url(#layerShadow)"
          />
          {/* Subtle architectural path accents */}
          <path
            d="M 160 250 C 130 350, 180 460, 290 480 C 400 490, 480 400, 450 290"
            stroke="url(#contourGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            fill="none"
            opacity="0.6"
          />
        </g>

        {/* ======================================================== */}
        {/* Layer 2: Main Flowing Coral Ribbon (11s cycle)          */}
        {/* ======================================================== */}
        <g className="animate-layer-medium origin-center">
          <path
            d="M 80 180 C 180 100, 360 120, 450 200 C 530 280, 520 410, 420 470 C 330 530, 200 480, 160 390 C 120 290, 150 210, 250 180 C 350 150, 430 220, 400 320 C 380 390, 310 430, 240 400 C 180 370, 200 300, 270 280"
            fill="url(#coralFlow)"
            filter="url(#layerShadow)"
            fillRule="evenodd"
          />
          {/* Crisp ribbon highlights */}
          <path
            d="M 95 185 C 190 110, 350 130, 440 205 C 510 280, 500 395, 410 455"
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
          />
        </g>

        {/* ======================================================== */}
        {/* Layer 3: Overlapping Translucent Rose Fold (14s cycle)  */}
        {/* ======================================================== */}
        <g className="animate-layer-float origin-center">
          <path
            d="M 220 140 C 320 80, 460 140, 490 250 C 520 370, 390 460, 290 440 C 190 420, 210 320, 290 280 C 370 240, 410 310, 380 370 C 360 410, 290 420, 240 370 C 200 330, 220 240, 280 200 Z"
            fill="url(#roseRibbon)"
            filter="url(#layerShadow)"
          />
          {/* Flowing stroke contour */}
          <path
            d="M 235 150 C 325 95, 445 150, 475 250 C 500 355, 390 435, 305 420"
            stroke="#ffffff"
            strokeWidth="1.2"
            fill="none"
            opacity="0.85"
          />
        </g>

        {/* ======================================================== */}
        {/* Layer 4: Intersecting Cream/Golden Accent Arc (9s cycle) */}
        {/* ======================================================== */}
        <g className="animate-layer-gentle origin-center">
          <path
            d="M 180 320 C 170 220, 250 150, 340 180 C 420 210, 450 310, 390 380 C 330 450, 230 420, 200 360 C 190 340, 185 330, 180 320 Z"
            fill="url(#creamFold)"
            filter="url(#layerShadow)"
          />
          
          {/* Inner core focal node: suggesting community hub */}
          <circle cx="310" cy="275" r="7" fill="#ffffff" opacity="0.9" />
          <circle cx="310" cy="275" r="16" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <circle cx="310" cy="275" r="28" stroke="#ff5722" strokeWidth="1" opacity="0.4" />
        </g>

        {/* ======================================================== */}
        {/* Layer 5: Fine Delicate Connection Coordinates (Pathways) */}
        {/* ======================================================== */}
        <g opacity="0.7">
          <circle cx="160" cy="180" r="3" fill="#ffffff" />
          <circle cx="480" cy="220" r="3.5" fill="#fca311" />
          <circle cx="420" cy="460" r="3" fill="#ff4081" />
          <circle cx="210" cy="470" r="3" fill="#b388ff" />
          <line x1="160" y1="180" x2="220" y2="140" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.5" />
          <line x1="420" y1="460" x2="480" y2="400" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.5" />
        </g>
      </svg>

    </div>
  );
}
