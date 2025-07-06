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
    <div className="mt-4 text-gray-800">
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleEmailClick}
          className="text-gray-800 hover:text-blue-500 transition-colors"
          title="Enviar email"
        >
          <FaEnvelope size={24} />
        </button>
        <a
          href="https://wa.me/5515920006629"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-800 hover:text-green-500 transition-colors"
          title="Enviar WhatsApp"
        >
          <FaWhatsapp size={24} />
        </a>
        <a
          href="https://github.com/michael-lourenco"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-800 hover:text-blue-500 transition-colors"
          title="GitHub"
        >
          <FaGithub size={24} />
        </a>
        <a
          href="https://www.linkedin.com/in/michael-lourenco/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-800 hover:text-blue-500 transition-colors"
          title="LinkedIn"
        >
          <FaLinkedin size={24} />
        </a>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Enviar Email</h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="space-y-3">
              <a
                href="mailto:kontempler@gmail.com?subject=Contato via Portfólio&body=Olá Michael,%0D%0A%0D%0AGostaria de entrar em contato contigo.%0D%0A%0D%0AAtenciosamente,"
                className="block w-full text-center py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Usar Cliente de Email
              </a>
              
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=kontempler@gmail.com&su=Contato via Portfólio&body=Olá Michael,%0D%0A%0D%0AGostaria de entrar em contato contigo.%0D%0A%0D%0AAtenciosamente,"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Abrir Gmail
              </a>
              
              <button
                onClick={() => setShowEmailModal(false)}
                className="block w-full text-center py-3 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
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
