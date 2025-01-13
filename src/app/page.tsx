import React from 'react';
import Header from '../components/Header';
import ProfessionalSummary from '../components/ProfessionalSummary';
import Experience from '../components/Experience';
import Education from '../components/Education';
import Skills from '../components/Skills';
import Languages from '../components/Languages';
import PersonalProjects from '../components/PersonalProjects';
import { ScrollToTop } from '@/components/ScrollToTop';

const Home: React.FC = () => {
  return (
    <main className="max-w-4xl mx-auto p-6 font-sans">
      <Header />
      <ProfessionalSummary />
      <Skills />
      <Experience />
      <Education />
      <Languages />
      <PersonalProjects />
      <ScrollToTop />
    </main>
  );
};

export default Home;
