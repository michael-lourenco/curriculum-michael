import React from 'react';

const PersonalProjects: React.FC = () => {
  return (
    <section className="mb-8">
      <h3 className="text-2xl font-semibold border-b pb-2">Projetos Pessoais</h3>
      <ul className="list-disc list-inside mt-4 text-gray-700">
      <li><strong>ContiGO:</strong> Desenvolvimento de website e app mobile (2025 - atual).</li>
        <li><strong>Pegriam:</strong> Desenvolvimento de website e app mobile (2025 - atual).</li>
        <li><strong>VNB Eventos:</strong> Desenvolvimento e manutenção do website do empreendimento VNB Eventos (2009 - 2014).</li>
        <li><strong>HoloSapiens:</strong> Aplicativo de Realidade Aumentada (2018 - 2019).</li>
        <li><strong>Grancardápio:</strong> Desenvolvimento de website e app mobile (2014 - 2015).</li>
      </ul>
    </section>
  );
};

export default PersonalProjects;
