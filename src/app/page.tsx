import React from 'react';
import Header from '../components/Header';
import ProfessionalSummary from '../components/ProfessionalSummary';
import Experience from '../components/Experience';
import Education from '../components/Education';
import Skills from '../components/Skills';
import Languages from '../components/Languages';
import Portifolio from '../components/Portifolio';
import { ScrollToTop } from '@/components/ScrollToTop';
import ThemeSelectionScreen from '../components/ThemeSelectionScreen';

const Home: React.FC = () => {
  return (
    <>
      <ThemeSelectionScreen />
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
        {/* Chat Demo */}
          {/* <div className="flex justify-center my-16">
            <iframe
              src="https://agent-michaellourenco.vercel.app/chat.html"
              width="100%"
              height="600"
              style={{
                border: "none",
                borderRadius: 12,
                boxShadow: "0 2px 8px #0001",
                maxWidth: 400,
                minWidth: 320,
                background: "white"
              }}
              title="Chat com o agente Michael Lourenço"
              allow="clipboard-write"
            ></iframe>
          </div> */}

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-border text-center">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
              <a 
                href="/terms" 
                className="text-text-secondary hover:text-primary text-sm transition-colors duration-200"
              >
                Terms of Service
              </a>
              <span className="text-text-secondary text-sm hidden sm:block">|</span>
              <a 
                href="/privacy" 
                className="text-text-secondary hover:text-primary text-sm transition-colors duration-200"
              >
                Privacy Policy
              </a>
            </div>
            <p className="text-text-secondary text-sm">
              © 2025 Michael Lourenço.
            </p>
          </footer>

          <ScrollToTop />
        </main>
      </div>
    </>
  );
};

export default Home;
