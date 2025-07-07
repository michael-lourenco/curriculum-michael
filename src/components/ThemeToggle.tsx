'use client';

import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Verificar se há tema salvo no localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Aplicar tema ao documento
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      
      // Salvar no localStorage
      localStorage.setItem('theme', theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  if (!mounted) {
    return (
      <button className="relative p-2 rounded-lg bg-surface hover:bg-surface-hover transition-all duration-200 border border-border">
        <div className="relative w-5 h-5">
          <FaSun className="absolute inset-0 w-5 h-5 text-text-muted" />
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg bg-surface hover:bg-surface-hover transition-all duration-200 border border-border"
      aria-label={`Alternar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}
      title={`Alternar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}
    >
      <div className="relative w-5 h-5">
        <FaSun 
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'light' 
              ? 'text-yellow-500 opacity-100 rotate-0' 
              : 'text-text-muted opacity-0 -rotate-90'
          }`}
        />
        <FaMoon 
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'dark' 
              ? 'text-blue-400 opacity-100 rotate-0' 
              : 'text-text-muted opacity-0 rotate-90'
          }`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle; 