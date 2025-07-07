'use client';

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Image from 'next/image';
import { FaExternalLinkAlt, FaEye, FaTimes } from 'react-icons/fa';

interface Project {
  id: number;
  name: string;
  image: string;
  description: string;
  technologies: string[];
  externalLink?: string;
  internalRoute?: string;
  status: 'active' | 'completed' | 'maintenance';
}

const projectsData: Project[] = [
  {
    id: 1,
    name: 'ContiGO',
    image: '/projects/placeholder.jpg',
    description: 'É um jogo eletrizante que vai exigir noções de lógica, cálculos, agilidade e nervos controlados',
    technologies: ['Next.js', 'TypeScript', 'Firebase', 'AWS'],
    externalLink: 'https://contigo-math.vercel.app/',
    status:'active',
  },
  {
    id: 2,
    name: 'Realidade Aumentada para eventos',
    image: '/projects/placeholder.jpg',
    description: 'Desenvolvimento de 11 aplicativos em Realidade Aumentada para eventos individuais da empresa Click-Se',
    technologies: ['Unity', 'Vuforia'],
    status:'completed',
  },
  {
    id: 3,
    name: 'HoloSapiens AR',
    image: '/projects/placeholder.jpg',
    description: 'Aplicativo de Realidade Aumentada para educação científica. Permitia visualizar modelos 3D de formas geométricas em tempo real.',
    technologies: ['Unity', 'C#', 'ARKit', 'ARCore', 'Blender'],
    status:'completed',
  },
  {
    id: 4,
    name: 'Grancardápio',
    image: '/projects/placeholder.jpg',
    description: 'Guia dos cardápios da cidade de Itapetininga-SP e Região. Exerci atividades de desenvolvedor fullstack, arquitetura de sistemas e demais áreas correlacionadas, pois era o único desenvolvedor. O aplicativo ficou disponível para Android e IOs',
    technologies: ["PHP","MySQL","JSON","Javascript","HTML","CSS"],
    status:'completed',
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-accent/10 text-accent';
    case 'completed': return 'bg-primary/10 text-primary';
    case 'maintenance': return 'bg-secondary/10 text-secondary';
    default: return 'bg-surface-hover text-text-secondary';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return 'Em Desenvolvimento';
    case 'completed': return 'Concluído';
    case 'maintenance': return 'Em Manutenção';
    default: return 'Desconhecido';
  }
};

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !project || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-surface rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-2xl">
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-surface rounded-full p-2 shadow-lg hover:bg-surface-hover transition-colors border border-border"
          >
            <FaTimes className="text-text-secondary" />
          </button>
          
          {/* Project image */}
          <div className="relative h-64 w-full">
            <Image
              src={project.image}
              alt={project.name}
              fill
              className="object-cover rounded-t-lg"
            />
          </div>
          
          {/* Project content */}
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-4 text-text-primary">{project.name}</h3>
            
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2 text-text-primary">Sobre o projeto:</h4>
              <p className="text-text-secondary leading-relaxed">{project.description}</p>
            </div>
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2 text-text-primary">Tecnologias utilizadas:</h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-surface-hover text-text-secondary rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-3">
              {project.externalLink && (
                <a
                  href={project.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
                >
                  <FaExternalLinkAlt />
                  Visitar projeto
                </a>
              )}
              {project.internalRoute && (
                <a
                  href={project.internalRoute}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors"
                >
                  <FaEye />
                  Ver detalhes
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

const Portifolio: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <section id="portifolio" className="section-card fade-in-up">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold mb-4 text-text-primary">Portifólio</h3>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectsData.map((project) => (
          <div
            key={project.id}
            className="group relative card overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          >
            {/* Project image */}
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {/* Overlay with buttons */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleProjectClick(project)}
                    className="flex items-center gap-2 px-4 py-2 bg-surface text-text-primary rounded-lg hover:bg-surface-hover transition-colors border border-border"
                  >
                    <FaEye />
                    Detalhes
                  </button>
                  
                  {project.externalLink && (
                    <a
                      href={project.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
                    >
                      <FaExternalLinkAlt />
                      Visitar
                    </a>
                  )}
                  
                  {project.internalRoute && (
                    <a
                      href={project.internalRoute}
                      className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
                    >
                      <FaEye />
                      Ver
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            {/* Project info */}
            <div className="p-6">
              <h4 className="text-xl font-bold mb-3 text-text-primary">{project.name}</h4>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.slice(0, 3).map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-surface-hover text-text-secondary rounded text-xs font-medium"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-2 py-1 bg-surface-hover text-text-secondary rounded text-xs font-medium">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>
              
              <p className="text-text-secondary text-sm line-clamp-3">
                {project.description}
              </p>
              <p className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {getStatusText(project.status)}
              </p> 
            </div>
          </div>
        ))}
      </div>
      
      {/* Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
      
      <div className="mt-8 pt-8 border-t border-border">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-surface-hover rounded-lg">
            <div className="text-2xl font-bold text-primary">5+</div>
            <div className="text-sm text-text-secondary">Projetos Desenvolvidos</div>
          </div>
          <div className="text-center p-4 bg-surface-hover rounded-lg">
            <div className="text-2xl font-bold text-secondary">3</div>
            <div className="text-sm text-text-secondary">Projetos Ativos</div>
          </div>
          <div className="text-center p-4 bg-surface-hover rounded-lg">
            <div className="text-2xl font-bold text-accent">10+</div>
            <div className="text-sm text-text-secondary">Tecnologias Utilizadas</div>
          </div>
          <div className="text-center p-4 bg-surface-hover rounded-lg">
            <div className="text-2xl font-bold text-primary">15+</div>
            <div className="text-sm text-text-secondary">Anos de Experiência</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portifolio; 