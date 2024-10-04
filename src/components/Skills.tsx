import React from 'react';

const Skills: React.FC = () => {
  return (
    <section className="mb-8">
      <h3 className="text-2xl font-semibold border-b pb-2">Habilidades Técnicas</h3>
      <ul className="list-disc list-inside mt-4 text-gray-700">
        <li><strong>Linguagens:</strong> Javascript/Typescript, Python, PHP, Dart, C#</li>
        <li><strong>Cloud:</strong> AWS, Google Cloud Platform, Serverless</li>
        <li><strong>Ferramentas:</strong> Git, Bitbucket, JIRA, Notion</li>
        <li><strong>Metodologias Ágeis:</strong> Scrum, Kanban</li>
        <li><strong>Outros:</strong> BPMN, Flutter, Wordpress REST API</li>
      </ul>
    </section>
  );
};

export default Skills;
