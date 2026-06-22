'use client';

import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSelectionScreen: React.FC = () => {
  const { setTheme } = useTheme();
  const [hasVisited, setHasVisited] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem('hasVisitedBefore');
    setHasVisited(!!visited);
    setMounted(true);
  }, []);

  const handleThemeSelection = (theme: 'light' | 'dark') => {
    localStorage.setItem('hasVisitedBefore', 'true');
    setTheme(theme);
    setHasVisited(true);
  };

  if (hasVisited === null || !mounted) {
    return null;
  }

  if (hasVisited) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex">
      <div
        className="flex-1 bg-white flex items-center justify-center cursor-pointer transition-all duration-500 hover:bg-gray-50 group"
        onClick={() => handleThemeSelection('light')}
      >
        <div className="text-center transform transition-transform duration-300 group-hover:scale-105">
          <div className="w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 rounded-full flex items-center justify-center shadow-2xl mb-4 md:mb-8 mx-auto group-hover:shadow-3xl transition-all duration-300">
            <FaSun className="text-white text-3xl md:text-5xl group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-2 md:mb-3">Modo Claro</h2>
          <p className="text-gray-600 text-sm md:text-lg px-4 md:px-0">
            Para uma experiência mais brilhante e energética
          </p>
        </div>
      </div>

      <div className="w-0.5 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

      <div
        className="flex-1 bg-gray-900 flex items-center justify-center cursor-pointer transition-all duration-500 hover:bg-gray-800 group"
        onClick={() => handleThemeSelection('dark')}
      >
        <div className="text-center transform transition-transform duration-300 group-hover:scale-105">
          <div className="w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-full flex items-center justify-center shadow-2xl mb-4 md:mb-8 mx-auto group-hover:shadow-3xl transition-all duration-300">
            <FaMoon className="text-white text-3xl md:text-5xl group-hover:-rotate-12 transition-transform duration-300" />
          </div>
          <h2 className="text-xl md:text-3xl font-bold text-white mb-2 md:mb-3">Modo Escuro</h2>
          <p className="text-gray-300 text-sm md:text-lg px-4 md:px-0">
            Para uma experiência mais suave e relaxante
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelectionScreen;
