import React from 'react';

const Education: React.FC = () => {
  return (
    <section className="mb-8">
      <h3 className="text-2xl font-semibold border-b pb-2">Formação Acadêmica</h3>
      <ul className="list-disc list-inside mt-4 text-gray-700">
        <li>Graduação em Informática para a Gestão de Negócios | Fatec Itapetininga</li>
        <li>Especialização em Tecnologias para Aplicações Web | Unopar</li>
        <li>Especialização em Informática Aplicada à Educação | IFSP Itapetininga</li>
      </ul>
    </section>
  );
};

export default Education;
