import React from 'react';
import { FaGlobe, FaStar } from 'react-icons/fa';

interface Language {
  name: string;
  level: string;
  proficiency: number;
  description: string;
  native?: boolean;
}

const Languages: React.FC = () => {
  const languages: Language[] = [
    {
      name: "Português",
      level: "Nativo",
      proficiency: 100,
      description: "Língua materna com fluência completa em comunicação técnica e comercial.",
      native: true
    },
    {
      name: "Inglês",
      level: "Intermediário Avançado",
      proficiency: 75,
      description: "Capacidade de leitura técnica, conversação em reuniões e escrita de documentação."
    }
  ];

  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 90) return "bg-accent";
    if (proficiency >= 70) return "bg-primary";
    if (proficiency >= 50) return "bg-secondary";
    return "bg-neutral-light";
  };

  const getStars = (proficiency: number) => {
    const stars = Math.floor(proficiency / 20);
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar 
        key={i} 
        className={`text-sm ${i < stars ? 'text-accent' : 'text-text-muted'}`} 
      />
    ));
  };

  return (
    <section id="languages" className="section-card fade-in-up">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold mb-4 text-text-primary">Idiomas</h3>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {languages.map((language, index) => (
          <div key={index} className="card hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl text-primary">
                  <FaGlobe />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-text-primary">{language.name}</h4>
                  <p className="text-primary font-medium">{language.level}</p>
                </div>
              </div>
              {language.native && (
                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                  Nativo
                </span>
              )}
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-text-secondary">Proficiência</span>
                <span className="text-sm font-bold text-text-primary">{language.proficiency}%</span>
              </div>
              <div className="w-full bg-surface-hover rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ease-out ${getProficiencyColor(language.proficiency)}`}
                  style={{ width: `${language.proficiency}%` }}
                ></div>
              </div>
            </div>

            {/* Stars rating */}
            <div className="flex items-center gap-1 mb-4">
              {getStars(language.proficiency)}
              <span className="text-sm text-text-secondary ml-2">
                {language.proficiency}/100
              </span>
            </div>

            {/* Description */}
            <p className="text-text-secondary text-sm leading-relaxed">
              {language.description}
            </p>

            {/* Skills breakdown */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">Leitura</div>
                  <div className="text-sm text-text-secondary">
                    {language.proficiency >= 90 ? 'Excelente' : 
                     language.proficiency >= 70 ? 'Boa' : 
                     language.proficiency >= 50 ? 'Regular' : 'Básica'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">Conversação</div>
                  <div className="text-sm text-text-secondary">
                    {language.proficiency >= 90 ? 'Fluente' : 
                     language.proficiency >= 70 ? 'Intermediária' : 
                     language.proficiency >= 50 ? 'Básica' : 'Limitada'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional language skills */}
      {/* <div className="mt-8 pt-8 border-t border-border">
        <h4 className="text-xl font-bold text-text-primary mb-4">Habilidades Adicionais</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-surface-hover rounded-lg text-center">
            <div className="text-2xl text-primary mb-2">📝</div>
            <h5 className="font-semibold text-text-primary mb-1">Documentação Técnica</h5>
            <p className="text-xs text-text-secondary">Escrevendo documentação técnica em inglês</p>
          </div>
          <div className="p-4 bg-surface-hover rounded-lg text-center">
            <div className="text-2xl text-primary mb-2">💬</div>
            <h5 className="font-semibold text-text-primary mb-1">Reuniões Internacionais</h5>
            <p className="text-xs text-text-secondary">Participação em calls com equipes globais</p>
          </div>
          <div className="p-4 bg-surface-hover rounded-lg text-center">
            <div className="text-2xl text-primary mb-2">📚</div>
            <h5 className="font-semibold text-text-primary mb-1">Leitura Técnica</h5>
            <p className="text-xs text-text-secondary">Compreensão de documentação e tutoriais</p>
          </div>
        </div>
      </div> */}
    </section>
  );
};

export default Languages;
