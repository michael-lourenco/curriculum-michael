import React from 'react';
import { FaChartLine, FaRocket, FaUsers, FaCode } from 'react-icons/fa';

const ProfessionalSummary: React.FC = () => {
  const metrics = [
    { icon: <FaChartLine />, value: "20+", label: "Anos de Experiência" },
    { icon: <FaRocket />, value: "50+", label: "Projetos Entregues" },
    { icon: <FaUsers />, value: "15+", label: "Empresas Atendidas" },
    { icon: <FaCode />, value: "10+", label: "Tecnologias Dominadas" },
  ];

  return (
    <section id="about" className="section-card fade-in-up">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold mb-4">Resumo Profissional</h3>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
      </div>

      {/* Métricas destacadas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center p-4 rounded-lg bg-surface-hover">
            <div className="text-3xl text-primary mb-2 flex justify-center">
              {metric.icon}
            </div>
            <div className="text-2xl font-bold text-text-primary">{metric.value}</div>
            <div className="text-sm text-text-secondary">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Descrição principal */}
      <div className="prose prose-lg max-w-none">
        <p className="text-text-secondary leading-relaxed mb-6">
          Desenvolvedor <strong className="text-primary">Backend Senior</strong> com mais de 20 anos de experiência, 
          especializado em arquiteturas <strong className="text-accent">cloud-native</strong> e sistemas de alta escala. 
          Atuo diariamente com tecnologias modernas como <strong>Node.js</strong>, <strong>Python</strong>, 
          <strong> AWS</strong> e <strong>GCP</strong>, desenvolvendo soluções que impactam milhões de usuários.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-primary">Especializações</h4>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                Arquiteturas de microsserviços
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                APIs RESTful e GraphQL
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                Otimização de performance
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                Automação de processos
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-primary">Resultados Recentes</h4>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                Redução de 60% na latência de APIs
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                Economia de 200+ horas/mês com automações
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                Implementação de CI/CD que reduziu deploys em 80%
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                Migração de sistemas legados para cloud
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalSummary;
