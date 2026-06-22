'use client';

import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg bg-surface hover:bg-surface-hover transition-all duration-200 border border-border"
      aria-label={`Alternar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}
      title={`Alternar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}
      disabled={!mounted}
    >
      <div className="relative w-5 h-5">
        <FaSun
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            !mounted || theme === 'light'
              ? 'text-yellow-500 opacity-100 rotate-0'
              : 'text-text-muted opacity-0 -rotate-90'
          }`}
        />
        <FaMoon
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            mounted && theme === 'dark'
              ? 'text-blue-400 opacity-100 rotate-0'
              : 'text-text-muted opacity-0 rotate-90'
          }`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
