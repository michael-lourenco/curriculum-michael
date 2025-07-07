'use client';

import React, { useState } from 'react';
import { FaGithub, FaLinkedin, FaWhatsapp, FaEnvelope, FaTimes } from 'react-icons/fa';

const ContactInfo: React.FC = () => {
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowEmailModal(true);
  };

  return (
    <div className="mt-4 text-text-primary">
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleEmailClick}
          className="text-text-primary hover:text-accent transition-colors"
          title="Enviar email"
        >
          <FaEnvelope size={24} />
        </button>
        <a
          href="https://wa.me/5515920006629"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-primary hover:text-accent transition-colors"
          title="Enviar WhatsApp"
        >
          <FaWhatsapp size={24} />
        </a>
        <a
          href="https://github.com/michael-lourenco"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-primary hover:text-accent transition-colors"
          title="GitHub"
        >
          <FaGithub size={24} />
        </a>
        <a
          href="https://www.linkedin.com/in/michael-lourenco/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-primary hover:text-accent transition-colors"
          title="LinkedIn"
        >
          <FaLinkedin size={24} />
        </a>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg p-6 max-w-md w-full border border-border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Enviar Email</h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-text-secondary hover:text-text-primary"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="space-y-3">
              <a
                href="mailto:kontempler@gmail.com?subject=Contato via Portfólio&body=Olá Michael,%0D%0A%0D%0AGostaria de entrar em contato contigo.%0D%0A%0D%0AAtenciosamente,"
                className="block w-full text-center py-3 px-4 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
              >
                Usar Cliente de Email
              </a>
              
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=kontempler@gmail.com&su=Contato via Portfólio&body=Olá Michael,%0D%0A%0D%0AGostaria de entrar em contato contigo.%0D%0A%0D%0AAtenciosamente,"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 px-4 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors"
              >
                Abrir Gmail
              </a>
              
              <button
                onClick={() => setShowEmailModal(false)}
                className="block w-full text-center py-3 px-4 bg-surface-hover text-text-primary rounded-lg hover:bg-border transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactInfo;
