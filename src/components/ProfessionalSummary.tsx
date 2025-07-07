import React from 'react';
import { FaChartLine, FaRocket, FaUsers, FaCode } from 'react-icons/fa';

const ProfessionalSummary: React.FC = () => {
  const highlights = [
    { icon: <FaChartLine />, title: "Experiência Sólida", description: "Desenvolvimento backend e arquitetura de sistemas" },
    { icon: <FaRocket />, title: "Tecnologias Modernas", description: "Node.js, Python, AWS, GCP e outras ferramentas" },
    { icon: <FaUsers />, title: "Trabalho em Equipe", description: "Colaboração e liderança técnica em projetos" },
    { icon: <FaCode />, title: "Soluções Robustas", description: "Sistemas escaláveis e de alta performance" },
  ];

  return (
    <section id="about" className="section-card fade-in-up">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold mb-4">Resumo Profissional</h3>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
      </div>

      {/* Destaques profissionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {highlights.map((highlight, index) => (
          <div key={index} className="text-center p-4 rounded-lg bg-surface-hover">
            <div className="text-3xl text-primary mb-3 flex justify-center">
              {highlight.icon}
            </div>
            <div className="text-lg font-semibold text-text-primary mb-2">{highlight.title}</div>
            <div className="text-sm text-text-secondary">{highlight.description}</div>
          </div>
        ))}
      </div>

      {/* Descrição principal */}
      <div className="prose prose-lg max-w-none">
        <p className="text-text-secondary leading-relaxed mb-6">
          Desenvolvedor <strong className="text-primary">Backend Senior</strong> com experiência em desenvolvimento 
          de software e arquitetura de sistemas. Especializado em tecnologias modernas como 
          <strong> Node.js</strong>, <strong>Python</strong>, <strong>AWS</strong> e <strong>GCP</strong>, 
          com foco em criar soluções robustas e escaláveis para diferentes tipos de projetos.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-primary">Principais Competências</h4>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                Desenvolvimento de APIs e microsserviços
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                Arquitetura de sistemas distribuídos
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                Implementação de soluções cloud
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                Otimização de performance e escalabilidade
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-primary">Áreas de Atuação</h4>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                Desenvolvimento backend e APIs
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                Arquitetura e design de sistemas
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                Implementação de infraestrutura cloud
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                Mentoria e liderança técnica
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalSummary;
