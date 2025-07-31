import React from 'react';

const IntroScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black animate-fade-in">
      {/* Simplified SVG with glowing blue text */}
      <svg width="400" height="150" viewBox="0 0 400 150">
        <text 
          x="50%" 
          y="50%" 
          dominantBaseline="middle" 
          textAnchor="middle" 
          fontSize="90" 
          fontWeight="bold" 
          fill="#4facfe" 
          fontFamily="Poppins, sans-serif"
          style={{ filter: 'drop-shadow(0 0 10px rgba(79, 172, 254, 0.7))' }}
        >
          SILVER
        </text>
      </svg>
    </div>
  );
};

export default IntroScreen;
