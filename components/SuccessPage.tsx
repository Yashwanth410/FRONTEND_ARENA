
import React, { useState, useEffect } from 'react';
import { CheckIcon } from './icons';

interface SuccessPageProps {
  username: string;
  onRedirect: () => void;
  isReconnecting: boolean;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ username, onRedirect, isReconnecting }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timerId = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      onRedirect();
    }
  }, [countdown, onRedirect]);

  return (
    <div className="relative w-[480px] max-w-[95%] bg-white/20 dark:bg-black/25 backdrop-blur-xl border border-white/20 dark:border-primary-dark/20 rounded-2xl shadow-lg shadow-primary-light/10 dark:shadow-2xl dark:shadow-primary-dark/40 text-text-primary-light dark:text-text-primary-dark transition-all duration-350 ease-in-out p-8 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in overflow-hidden">
      <CheckIcon />
      <h1 className="text-3xl font-bold [text-shadow:0_0_6px_rgba(8,102,255,0.4)] dark:[text-shadow:0_0_10px_rgba(79,172,254,0.6)]">
        {isReconnecting ? `Welcome Back, ${username}!` : 'OAuth Success'}
      </h1>
      <p className="text-text-secondary-light dark:text-text-secondary-dark">
        {isReconnecting ? 'Reconnecting you to the application...' : 'You have been successfully authenticated.'}
      </p>

      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-4">
        Redirecting in {countdown}...
      </p>

      {/* Progress Bar for redirect */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-light/20 dark:bg-primary-dark/20">
        <div 
          className="h-full bg-primary-light dark:bg-primary-dark" 
          style={{ width: `${(5 - countdown) * 20}%`, transition: 'width 1s linear' }}
        ></div>
      </div>
    </div>
  );
};

export default SuccessPage;
