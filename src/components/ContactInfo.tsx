import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const ContactInfo: React.FC = () => {
  return (
    <div className="mt-4 text-gray-800">
      <p>
        <a
          href="mailto:kontempler@gmail.com"
          className="text-black-500 hover:underline"
        >
          kontempler@gmail.com
        </a>
      </p>
      <p>+55 (15) 92000-6629</p>
      <div className="flex justify-center space-x-4 mt-4">
        <a
          href="https://github.com/michael-lourenco"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-800 hover:text-blue-500 transition-colors"
        >
          <FaGithub size={24} />
        </a>
        <a
          href="https://www.linkedin.com/in/michael-lourenco/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-800 hover:text-blue-500 transition-colors"
        >
          <FaLinkedin size={24} />
        </a>
      </div>
    </div>
  );
};

export default ContactInfo;
