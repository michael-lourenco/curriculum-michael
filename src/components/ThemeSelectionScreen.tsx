'use client';

import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeSelectionScreen: React.FC = () => {
  const [hasVisited, setHasVisited] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já visitou a página
    const visited = localStorage.getItem('hasVisitedBefore');
    setHasVisited(!!visited);
    setMounted(true);
  }, []);

  const handleThemeSelection = (theme: 'light' | 'dark') => {
    // Salvar que o usuário já visitou
    localStorage.setItem('hasVisitedBefore', 'true');
    localStorage.setItem('theme', theme);
    
    // Aplicar o tema diretamente ao documento
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Marcar como visitado
    setHasVisited(true);
  };



  // Se ainda está carregando, não mostrar nada
  if (hasVisited === null || !mounted) {
    return null;
  }

  // Se já visitou, não mostrar a tela de seleção
  if (hasVisited) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex">
      {/* Lado Esquerdo - Tema Light */}
      <div 
        className="flex-1 bg-white flex items-center justify-center cursor-pointer transition-all duration-500 hover:bg-gray-50 group"
        onClick={() => handleThemeSelection('light')}
      >
        <div className="text-center transform transition-transform duration-300 group-hover:scale-105">
          <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 rounded-full flex items-center justify-center shadow-2xl mb-8 mx-auto group-hover:shadow-3xl transition-all duration-300">
            <FaSun className="text-white text-5xl group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Modo Claro</h2>
          <p className="text-gray-600 text-lg">Para uma experiência mais brilhante e energética</p>
        </div>
      </div>

      {/* Divisor Central */}
      <div className="w-0.5 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

      {/* Lado Direito - Tema Dark */}
      <div 
        className="flex-1 bg-gray-900 flex items-center justify-center cursor-pointer transition-all duration-500 hover:bg-gray-800 group"
        onClick={() => handleThemeSelection('dark')}
      >
        <div className="text-center transform transition-transform duration-300 group-hover:scale-105">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-full flex items-center justify-center shadow-2xl mb-8 mx-auto group-hover:shadow-3xl transition-all duration-300">
            <FaMoon className="text-white text-5xl group-hover:-rotate-12 transition-transform duration-300" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Modo Escuro</h2>
          <p className="text-gray-300 text-lg">Para uma experiência mais suave e relaxante</p>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelectionScreen; 