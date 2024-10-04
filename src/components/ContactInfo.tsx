import React from 'react';

const ContactInfo: React.FC = () => {
  return (
    <div className="mt-4 text-gray-800">
      <p>📍 Itapetininga – SP</p>
      <p>📧 <a href="mailto:kontempler@gmail.com" className="text-blue-500 hover:underline">kontempler@gmail.com</a></p>
      <p>📞 +55 (15) 92000-6629</p>
      <p>
        <a href="https://github.com/michael-lourenco" className="text-blue-500 hover:underline">GitHub</a> |{' '}
        <a href="https://www.linkedin.com/in/michael-lourenco/" className="text-blue-500 hover:underline">LinkedIn</a>
      </p>
    </div>
  );
};

export default ContactInfo;
