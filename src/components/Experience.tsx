import React from 'react';

const Experience: React.FC = () => {
  return (
    <section className="mb-8">
      <h3 className="text-2xl font-semibold border-b pb-2">Experiência Profissional</h3>
      <div className="mt-4">
        <h4 className="text-lg font-bold">Pixter (São Paulo – SP) | Remoto</h4>
        <span className="block font-medium mb-2">Desenvolvedor Back end Pleno | Agosto de 2020 até Outubro 2024</span>
        <ul className="list-disc list-inside text-gray-700">
          <li><strong>Amazon:</strong> Interação com profissionais do México, desenvolvimento de sistema para integração com API da Tecalliance e AWS, cadastrando novos produtos na Amazon (SPI-API).</li>
          <li><strong>Multiplier App:</strong> Desenvolvimento de API e microsserviços para transmissão de Stream Lives utilizando AWS.</li>
          <li><strong>Porto Seguro:</strong> Desenvolvimento e melhorias em fluxos de negócios e banco de dados utilizando GCP.</li>
          <li><strong>PxTalk:</strong> Desenvolvimento de uma interface mobile para sistema de controle de entrada de condomínios.</li>
        </ul>
      </div>
    </section>
  );
};

export default Experience;
