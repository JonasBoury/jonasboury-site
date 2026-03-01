import { useEffect, useState } from "react";

interface TripOpeningAnimationProps {
  onComplete: () => void;
}

export const TripOpeningAnimation = ({ onComplete }: TripOpeningAnimationProps) => {
  const [showText, setShowText] = useState(false);
  const [startLine, setStartLine] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Text appears immediately
    setTimeout(() => setShowText(true), 300);
    
    // Line animation starts
    setTimeout(() => setStartLine(true), 1200);
    
    // Start fade out
    setTimeout(() => setFadeOut(true), 4500);
    
    // Complete animation
    setTimeout(() => onComplete(), 5000);
  }, [onComplete]);

  // Hand-drawn mountain path with irregular, sketchy lines
  const mountainPath = `
    M 0,405 
    Q 20,403 40,407 
    L 60,404 L 80,406 L 100,402 
    Q 130,398 160,403 
    L 180,397 
    Q 195,360 205,305 Q 215,355 225,395 
    L 245,403 L 265,407 L 285,401 
    Q 320,405 350,402 
    L 380,404 L 410,398 
    Q 445,360 465,280 Q 480,250 510,265 Q 530,290 555,390 
    L 580,402 L 610,405 
    Q 650,398 690,403 
    L 720,401 L 750,405 
    Q 780,390 805,335 Q 825,315 855,395 
    L 880,402 L 910,404 L 940,399 
    Q 980,403 1020,405 
    L 1200,407
  `;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Text */}
      <div
        className={`text-center mb-20 px-4 transition-all duration-700 ${
          showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">The Moelleux Club</h1>
        <p className="text-xl md:text-2xl text-muted-foreground">
          Get ready for the expedition
        </p>
      </div>

      {/* Mountain Line Animation */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 1200 500"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            </linearGradient>
            
            {/* Hand-drawn filter for sketchy effect */}
            <filter id="roughen">
              <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
            </filter>
          </defs>
          
          {/* Main line */}
          <path
            d={mountainPath}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#roughen)"
            className={`transition-all duration-1000 ${
              startLine ? "animate-draw-line" : ""
            }`}
            style={{
              strokeDasharray: startLine ? "3000" : "3000",
              strokeDashoffset: startLine ? "0" : "3000",
              filter: "drop-shadow(0 0 8px hsl(var(--primary) / 0.4))",
            }}
          />
          
          {/* Shadow line for hand-drawn effect */}
          <path
            d={mountainPath}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.3"
            filter="url(#roughen)"
            className={`transition-all duration-1000 ${
              startLine ? "animate-draw-line-offset" : ""
            }`}
            style={{
              strokeDasharray: startLine ? "3000" : "3000",
              strokeDashoffset: startLine ? "0" : "3000",
              transform: "translate(2px, 2px)",
            }}
          />
        </svg>
      </div>

      <style>{`
        @keyframes draw-line {
          from {
            stroke-dashoffset: 3000;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes draw-line-offset {
          from {
            stroke-dashoffset: 3000;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        
        .animate-draw-line {
          animation: draw-line 3s ease-out forwards;
        }
        
        .animate-draw-line-offset {
          animation: draw-line-offset 3s ease-out 0.1s forwards;
        }
      `}</style>
    </div>
  );
};
