import React from 'react';
import Image from 'next/image';
import ContactInfo from './ContactInfo';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-10">
      <div className="flex justify-center mb-6">
        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-300 shadow-lg">
          <Image
            src="/profile.jpg"
            alt="Foto de Michael Gomes da Cunha Lourenço"
            width={160}
            height={160}
            className="object-cover"
            priority
          />
        </div>
      </div>
      <h1 className="text-4xl font-bold">Michael Lourenço</h1>
      <h2 className="text-2xl text-gray-600">Desenvolvedor Back end</h2>
      <ContactInfo />
    </header>
  );
};

export default Header;
