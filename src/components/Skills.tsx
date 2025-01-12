'use client';

import React, { useState } from 'react';
import { FaClipboard, FaJs, FaPython, FaPhp, FaAws, FaGoogle, FaServer, FaGit, FaJira, FaCogs, FaClipboardList } from 'react-icons/fa';
import { SiTypescript, SiDart, SiNotion, SiScrumalliance } from 'react-icons/si';

const skillsData = {
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
    <section className="mb-8">
      <h3 className="text-3xl font-bold text-center mb-6">Skills</h3>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-2 justify-center">
        {Object.keys(skillsData).map((category) => (
          <div
            key={category}
            onClick={() => handleCategoryChange(category as keyof typeof skillsData)}
            className={`inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border-transparent ${
              selectedCategory === category
                ? 'bg-blue-500 text-white hover:bg-blue-400'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">{skill.icon}</span>
              <h4 className="text-lg font-semibold">{skill.name}</h4>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full"
                style={{ width: `${skill.percentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{skill.percentage}%</p>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {skillsData[selectedCategory].length > 10 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {showAll ? 'Mostrar menos' : 'Mostrar mais'}
          </button>
        </div>
      )}
    </section>
  );
};

export default Skills;
