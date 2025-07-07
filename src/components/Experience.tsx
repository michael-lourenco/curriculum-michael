import React from 'react';
import { FaBuilding, FaCalendar, FaMapMarkerAlt, FaRocket, FaUsers, FaCog, FaMobile } from 'react-icons/fa';

interface ExperienceItem {
  company: string;
  location: string;
  position: string;
  period: string;
  description: string;
  technologies: string[];
  achievements: string[];
  icon: React.ReactNode;
}

const Experience: React.FC = () => {
  const experiences: ExperienceItem[] = [
    {
      company: "Pixter",
      location: "São Paulo – SP | Remoto",
      position: "Desenvolvedor Backend Pleno",
      period: "Agosto 2020 - Outubro 2024",
      description: "Desenvolvimento de sistemas de alta escala para empresas Fortune 500, com foco em arquiteturas cloud-native e microsserviços.",
      technologies: ["Node.js", "AWS", "GCP", "Python", "Docker", "Kubernetes"],
      achievements: [
        "Redução de 60% na latência de APIs da Amazon",
        "Implementação de sistema de streaming para 1M+ usuários",
        "Migração de sistemas legados para cloud",
        "Desenvolvimento de interface mobile para controle de condomínios"
      ],
      icon: <FaBuilding />
    }
  ];

  return (
    <section className="section-card fade-in-up" id="experience">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold mb-4 text-text-primary">Experiência Profissional</h3>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-accent hidden md:block"></div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div key={index} className="relative">
              {/* Timeline dot */}
              <div className="absolute left-6 top-6 w-4 h-4 bg-primary rounded-full border-4 border-surface shadow-lg hidden md:block"></div>

              <div className="md:ml-16">
                <div className="card hover:shadow-xl transition-all duration-300">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl text-primary">
                        {exp.icon}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-text-primary">{exp.company}</h4>
                        <p className="text-text-secondary flex items-center gap-2">
                          <FaMapMarkerAlt className="text-sm" />
                          {exp.location}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {exp.period}
                      </span>
                    </div>
                  </div>

                  {/* Position */}
                  <h5 className="text-lg font-semibold text-primary mb-3">{exp.position}</h5>

                  {/* Description */}
                  <p className="text-text-secondary mb-4 leading-relaxed">
                    {exp.description}
                  </p>

                  {/* Technologies */}
                  <div className="mb-4">
                    <h6 className="text-sm font-semibold text-text-primary mb-2">Tecnologias Utilizadas:</h6>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-surface-hover text-text-secondary rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div>
                    <h6 className="text-sm font-semibold text-text-primary mb-2">Principais Conquistas:</h6>
                    <ul className="space-y-2">
                      {exp.achievements.map((achievement, achievementIndex) => (
                        <li key={achievementIndex} className="flex items-start gap-2 text-text-secondary">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Project highlights */}
                  <div className="mt-6 pt-4 border-t border-border">
                    <h6 className="text-sm font-semibold text-text-primary mb-3">Projetos Destacados:</h6>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-3 bg-surface-hover rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <FaRocket className="text-accent" />
                          <span className="font-medium text-sm">Amazon SPI-API</span>
                        </div>
                        <p className="text-xs text-text-secondary">
                          Integração com API da Tecalliance e AWS para cadastro de produtos
                        </p>
                      </div>
                      <div className="p-3 bg-surface-hover rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <FaUsers className="text-secondary" />
                          <span className="font-medium text-sm">Multiplier App</span>
                        </div>
                        <p className="text-xs text-text-secondary">
                          APIs e microsserviços para transmissão de Stream Lives
                        </p>
                      </div>
                      <div className="p-3 bg-surface-hover rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <FaCog className="text-primary" />
                          <span className="font-medium text-sm">Porto Seguro</span>
                        </div>
                        <p className="text-xs text-text-secondary">
                          Melhorias em fluxos de negócios e banco de dados com GCP
                        </p>
                      </div>
                      <div className="p-3 bg-surface-hover rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <FaMobile className="text-accent" />
                          <span className="font-medium text-sm">PxTalk</span>
                        </div>
                        <p className="text-xs text-text-secondary">
                          Interface mobile para controle de entrada de condomínios
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
