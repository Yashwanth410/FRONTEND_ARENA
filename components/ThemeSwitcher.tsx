
import React from 'react';
import { Theme } from '../types';
import { SunIcon, MoonIcon } from './icons';

interface ThemeSwitcherProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-card-bg-light dark:bg-card-bg-dark border border-input-border-light dark:border-input-border-dark shadow-sm hover:shadow-md transition-all duration-300 group"
      aria-label="Toggle theme"
    >
      <div className="group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 ease-in-out">
        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
      </div>
    </button>
  );
};

export default ThemeSwitcher;
