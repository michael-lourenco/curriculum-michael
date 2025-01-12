import React from 'react';
import Header from '../components/Header';
import ProfessionalSummary from '../components/ProfessionalSummary';
import Experience from '../components/Experience';
import Education from '../components/Education';
import Skills from '../components/Skills';
import Languages from '../components/Languages';
import PersonalProjects from '../components/PersonalProjects';

const Home: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <Header />
      <ProfessionalSummary />
      <Skills />
      <Experience />
      <Education />
      <Languages />
      <PersonalProjects />
    </div>
  );
};

export default Home;
