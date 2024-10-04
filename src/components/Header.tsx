import React from 'react';
import ContactInfo from './ContactInfo';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-10">
      <h1 className="text-4xl font-bold">Michael Gomes da Cunha Lourenço</h1>
      <h2 className="text-2xl text-gray-600">Desenvolvedor Back end</h2>
      <ContactInfo />
    </header>
  );
};

export default Header;
