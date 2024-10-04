import React from 'react';

const Languages: React.FC = () => {
  return (
    <section className="mb-8">
      <h3 className="text-2xl font-semibold border-b pb-2">Idiomas</h3>
      <ul className="list-disc list-inside mt-4 text-gray-700">
        <li>Português (nativo)</li>
        <li>Inglês intermediário (conversação e leitura técnica)</li>
      </ul>
    </section>
  );
};

export default Languages;
