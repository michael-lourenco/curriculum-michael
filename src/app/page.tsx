import React from 'react';
import Header from '../components/Header';
import ProfessionalSummary from '../components/ProfessionalSummary';
import Experience from '../components/Experience';
import Education from '../components/Education';
import Skills from '../components/Skills';
import Languages from '../components/Languages';
import Portifolio from '../components/Portifolio';
import { ScrollToTop } from '@/components/ScrollToTop';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
      <main className="max-w-6xl mx-auto p-6 font-sans">
        {/* Hero Section */}
        <div className="mb-12">
          <Header />
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          <ProfessionalSummary />
          <Skills />
          <Experience />
          <Education />
          <Languages />
          <Portifolio />
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-text-secondary text-sm">
            © 2025 Michael Lourenço.
          </p>
        </footer>

        <ScrollToTop />
      </main>
    </div>
  );
};

export default Home;
