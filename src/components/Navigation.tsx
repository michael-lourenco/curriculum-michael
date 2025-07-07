'use client';

import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaHome, FaUser, FaCode, FaBriefcase, FaGraduationCap, FaGlobe, FaRocket } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navItems: NavItem[] = [
    { id: 'home', label: 'Início', icon: <FaHome /> },
    { id: 'about', label: 'Sobre', icon: <FaUser /> },
    { id: 'skills', label: 'Skills', icon: <FaCode /> },
    { id: 'experience', label: 'Experiência', icon: <FaBriefcase /> },
    { id: 'education', label: 'Educação', icon: <FaGraduationCap /> },
    { id: 'languages', label: 'Idiomas', icon: <FaGlobe /> },
    { id: 'portifolio', label: 'Portifólio', icon: <FaRocket /> },
  ];

  // Detectar seção ativa baseada no scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 120; // Offset ajustado para compensar o menu

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Altura do menu + margem extra
      const elementPosition = element.offsetTop - offset;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Nome */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary">
                Michael <span className="gradient-text">Lourenço</span>
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-primary text-white shadow-md'
                      : 'text-text-secondary hover:text-primary hover:bg-surface-hover'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
              
              {/* Theme Toggle */}
              <div className="ml-4">
                <ThemeToggle />
              </div>
            </div>

            {/* Mobile Menu Button and Theme Toggle */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-surface-hover transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-surface border-b border-border shadow-lg">
            <div className="px-6 py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:text-primary hover:bg-surface-hover'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer para compensar o menu fixo */}
      <div className="h-16"></div>
    </>
  );
};

export default Navigation; 