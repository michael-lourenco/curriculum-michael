'use client';

import React from 'react';
import Image from 'next/image';
import ContactInfo from './ContactInfo';
import { FaDownload, FaEye } from 'react-icons/fa';

const Header: React.FC = () => {
  const handleDownloadCV = () => {
    // Link para download do CV (você pode adicionar o arquivo PDF na pasta public)
    window.open('/michael-lourenco-cv.pdf', '_blank');
  };

  const handleViewProjects = () => {
    // Scroll suave para a seção de projetos
    const element = document.getElementById('portifolio');
    if (element) {
      const offset = 80; // Altura do menu + margem extra
      const elementPosition = element.offsetTop - offset;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header id="home" className="text-center mb-12 fade-in-up">
      {/* Foto de perfil com efeito moderno */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-surface shadow-xl ring-4 ring-primary/20">
            <Image
              src="/profile.jpg"
              alt="Foto de Michael Gomes da Cunha Lourenço"
              width={160}
              height={160}
              className="object-cover"
              priority
            />
          </div>
          {/* Indicador de status online */}
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-accent rounded-full border-4 border-surface shadow-lg"></div>
        </div>
      </div>

      {/* Informações principais */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-4 text-text-primary">
          Michael <span className="gradient-text">Lourenço</span>
        </h1>
        <h2 className="text-2xl text-text-secondary mb-2">Desenvolvedor Backend Senior</h2>
        <p className="text-text-muted text-lg max-w-2xl mx-auto">
          Especialista em arquiteturas cloud-native, APIs e sistemas de alta escala com 20+ anos de experiência
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <button 
          onClick={handleDownloadCV}
          className="btn btn-primary"
        >
          <FaDownload />
          Baixar CV
        </button>
        <button 
          onClick={handleViewProjects}
          className="btn btn-secondary"
        >
          <FaEye />
          Portifólio
        </button>
      </div>

      {/* Informações de contato */}
      <ContactInfo />
    </header>
  );
};

export default Header;
