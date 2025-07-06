'use client';

import React, { useState } from 'react';
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
}

const projectsData: Project[] = [
  {
    id: 1,
    name: 'ContiGO',
    image: '/projects/contigo.jpg',
    description: 'Sistema completo de gestão empresarial desenvolvido com tecnologias modernas. Inclui módulos de vendas, estoque, financeiro e relatórios avançados. Interface intuitiva e responsiva para desktop e mobile.',
    technologies: ['React', 'Node.js', 'TypeScript', 'Firebase', 'Tailwind CSS'],
    externalLink: 'https://contigo-math.vercel.app/'
  },
  {
    id: 2,
    name: 'Jogo do Ano',
    image: '/projects/jogodoano.jpg',
    description: 'O Jogo do Ano é uma iniciativa criada por entusiastas de games para celebrar a excelência e a inovação na indústria de jogos eletrônicos. Nosso objetivo é proporcionar uma plataforma onde os jogadores possam expressar suas opiniões e reconhecer os títulos que trouxeram as melhores experiências ao longo do ano.',
    technologies: ['React', 'Typescript', 'Firebase', 'Stripe API'],
    externalLink: 'https://jogodoano.vercel.app'
  },
  {
    id: 3,
    name: 'HoloSapiens AR',
    image: '/projects/holosapiens.jpg',
    description: 'Aplicativo de Realidade Aumentada para educação científica. Permite visualizar modelos 3D de anatomia humana e estruturas celulares em tempo real.',
    technologies: ['Unity', 'C#', 'ARKit', 'ARCore', 'Blender'],
    internalRoute: '/projects/holosapiens'
  },
  {
    id: 4,
    name: 'Grancardápio',
    image: '/projects/grancardapio.jpg',
    description: 'Sistema de cardápio digital para restaurantes. Interface touch-friendly, sincronização em tempo real entre dispositivos e integração com sistemas de pedidos.',
    technologies: ['Flutter', 'Firebase', 'Dart', 'Google Cloud', 'Real-time Database'],
    externalLink: 'https://grancardapio.com'
  }
];

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }: ProjectModalProps) => {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          >
            <FaTimes className="text-gray-600" />
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
            <h3 className="text-2xl font-bold mb-4">{project.name}</h3>
            
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2">Sobre o projeto:</h4>
              <p className="text-gray-700 leading-relaxed">{project.description}</p>
            </div>
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2">Tecnologias utilizadas:</h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
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
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <FaExternalLinkAlt />
                  Visitar projeto
                </a>
              )}
              {project.internalRoute && (
                <a
                  href={project.internalRoute}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
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
};

const ActualPersonalProjects: React.FC = () => {
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
    <section className="mb-12">
      <h3 className="text-3xl font-bold text-center mb-8">Portifólio</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectsData.map((project) => (
          <div
            key={project.id}
            className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
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
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FaEye />
                    Detalhes
                  </button>
                  
                  {project.externalLink && (
                    <a
                      href={project.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <FaExternalLinkAlt />
                      Visitar
                    </a>
                  )}
                  
                  {project.internalRoute && (
                    <a
                      href={project.internalRoute}
                      className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
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
              <h4 className="text-xl font-bold mb-3 text-gray-800">{project.name}</h4>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.slice(0, 3).map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-3">
                {project.description}
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
    </section>
  );
};

export default ActualPersonalProjects; 