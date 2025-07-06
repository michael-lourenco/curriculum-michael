import React from 'react';
import { FaGraduationCap, FaUniversity, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  location: string;
  description: string;
  icon: React.ReactNode;
}

const Education: React.FC = () => {
  const educationItems: EducationItem[] = [
    {
      degree: "Graduação em Informática para a Gestão de Negócios",
      institution: "Fatec Itapetininga",
      period: "2018 - 2021",
      location: "Itapetininga, SP",
      description: "Formação técnica em gestão de negócios com foco em tecnologia da informação, incluindo programação, banco de dados e gestão de projetos.",
      icon: <FaGraduationCap />
    },
    {
      degree: "Especialização em Tecnologias para Aplicações Web",
      institution: "Unopar",
      period: "2019 - 2020",
      location: "Online",
      description: "Especialização em desenvolvimento web moderno, incluindo frameworks, APIs, e arquiteturas de aplicações web escaláveis.",
      icon: <FaUniversity />
    },
    {
      degree: "Especialização em Informática Aplicada à Educação",
      institution: "IFSP Itapetininga",
      period: "2020 - 2021",
      location: "Itapetininga, SP",
      description: "Especialização focada na aplicação de tecnologias educacionais e desenvolvimento de soluções para o setor educacional.",
      icon: <FaUniversity />
    }
  ];

  return (
    <section id="education" className="section-card fade-in-up">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold mb-4">Formação Acadêmica</h3>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
      </div>

      <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
        {educationItems.map((item, index) => (
          <div key={index} className="card hover:shadow-xl transition-all duration-300 group">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl text-primary group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div>
                <h4 className="text-lg font-bold text-text-primary">{item.degree}</h4>
                <p className="text-primary font-medium">{item.institution}</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-text-secondary">
                <FaCalendarAlt className="text-sm" />
                <span className="text-sm">{item.period}</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <FaMapMarkerAlt className="text-sm" />
                <span className="text-sm">{item.location}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-text-secondary text-sm leading-relaxed">
              {item.description}
            </p>

            {/* Status badge */}
            <div className="mt-4 pt-4 border-t border-border">
              <span className="inline-flex items-center px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
                Concluído
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Additional certifications section */}
      <div className="mt-8 pt-8 border-t border-border">
        <h4 className="text-xl font-bold text-text-primary mb-4">Certificações Adicionais</h4>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-surface-hover rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="font-medium text-sm">AWS Certified Developer</span>
            </div>
            <p className="text-xs text-text-secondary">Amazon Web Services</p>
          </div>
          <div className="p-4 bg-surface-hover rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span className="font-medium text-sm">Google Cloud Professional</span>
            </div>
            <p className="text-xs text-text-secondary">Google Cloud Platform</p>
          </div>
          <div className="p-4 bg-surface-hover rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="font-medium text-sm">Scrum Master Certified</span>
            </div>
            <p className="text-xs text-text-secondary">Scrum Alliance</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
