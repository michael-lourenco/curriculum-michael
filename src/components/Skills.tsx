'use client';

import React, { useState } from 'react';
import { FaClipboard, FaJs, FaPython, FaPhp, FaAws, FaGoogle, FaServer, FaGit, FaJira, FaCogs, FaClipboardList } from 'react-icons/fa';
import { SiTypescript, SiDart, SiNotion, SiScrumalliance } from 'react-icons/si';

interface SkillData {
  name: string;
  icon: React.ReactNode;
  percentage: number;
}

const skillsData: { [category: string]: SkillData[] } = {
  Linguagens: [
    { name: 'JavaScript', icon: <FaJs />, percentage: 90 },
    { name: 'TypeScript', icon: <SiTypescript />, percentage: 85 },
    { name: 'Python', icon: <FaPython />, percentage: 80 },
    { name: 'PHP', icon: <FaPhp />, percentage: 75 },
    { name: 'Dart', icon: <SiDart />, percentage: 70 },
    { name: 'C#', icon: <FaCogs />, percentage: 65 },
  ],
  Cloud: [
    { name: 'AWS', icon: <FaAws />, percentage: 85 },
    { name: 'Google Cloud Platform', icon: <FaGoogle />, percentage: 80 },
    { name: 'Serverless', icon: <FaServer />, percentage: 75 },
  ],
  Ferramentas: [
    { name: 'Git', icon: <FaGit />, percentage: 90 },
    { name: 'JIRA', icon: <FaJira />, percentage: 80 },
    { name: 'Notion', icon: <SiNotion />, percentage: 85 },
  ],
  Metodologias: [
    { name: 'Scrum', icon: <SiScrumalliance />, percentage: 85 },
    { name: 'Kanban', icon: <FaClipboard />, percentage: 80 },
  ],
  Outros: [
    { name: 'BPMN', icon: <FaClipboardList />, percentage: 70 },
    { name: 'Flutter', icon: <SiDart />, percentage: 75 },
    { name: 'WordPress REST API', icon: <FaCogs />, percentage: 65 },
  ],
};

const Skills: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof skillsData>('Linguagens');
  const [showAll, setShowAll] = useState(false);

  const handleCategoryChange = (category: keyof typeof skillsData) => {
    setSelectedCategory(category);
    setShowAll(false); // Reset "show more" when switching categories
  };

  const skillsToDisplay = skillsData[selectedCategory].slice(0, showAll ? undefined : 10);

  return (
    <section id="skills" className="section-card fade-in-up">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold mb-4 text-text-primary">Skills</h3>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-2 justify-center">
        {Object.keys(skillsData).map((category) => (
          <div
            key={category}
            onClick={() => handleCategoryChange(category as keyof typeof skillsData)}
            className={`inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 border-transparent ${
              selectedCategory === category
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'bg-surface-hover text-text-secondary hover:bg-border'
            } text-sm cursor-pointer`}
          >
            {category}
          </div>
        ))}
      </div>

      {/* Skills List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skillsToDisplay.map((skill) => (
          <div
            key={skill.name}
            className="p-4 border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-surface"
          >
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl text-primary">{skill.icon}</span>
              <h4 className="text-lg font-semibold text-text-primary">{skill.name}</h4>
            </div>
            <div className="w-full bg-surface-hover rounded-full h-2.5">
              <div
                className="bg-accent h-2.5 rounded-full"
                style={{ width: `${skill.percentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-text-secondary mt-1">{skill.percentage}%</p>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {skillsData[selectedCategory].length > 10 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            {showAll ? 'Mostrar menos' : 'Mostrar mais'}
          </button>
        </div>
      )}
    </section>
  );
};

export default Skills;
