import React from 'react';

const CompanyLogo: React.FC = () => {
  return (
    <div className="fixed top-8 left-8 z-20 cursor-default group">
      {/* Container with fixed height to prevent layout shift */}
      <div className="relative h-12 w-48 flex items-center">
        {/* SILVER Text - fades out */}
        <h2 className="absolute text-4xl font-semibold text-primary-light dark:text-primary-dark [text-shadow:0_0_8px_rgba(8,102,255,0.5)] dark:[text-shadow:0_0_12px_rgba(79,172,254,0.5)] transition-opacity duration-300 ease-in-out group-hover:opacity-0">
          SILVER
        </h2>
        {/* Tarun Muddana Text - pops up and fades in */}
        <p className="absolute font-orbitron text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out">
          Tarun Muddana
        </p>
      </div>
    </div>
  );
};

export default CompanyLogo;
