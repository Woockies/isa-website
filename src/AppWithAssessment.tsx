import React, { useState } from 'react';
import AssessmentForm from './components/AssessmentForm';

export default function App() {
  const [page, setPage] = useState<'home' | 'assessment'>('home');

  if (page === 'assessment') {
    return <AssessmentForm />;
  }

  // Original home page code (same as App.tsx, but truncated for space)
  return (
    <div className="min-h-screen bg-isa-space text-isa-alice font-sans selection:bg-isa-canary selection:text-isa-space">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center backdrop-blur-sm border-b border-isa-alice/5">
        <div className="text-xs font-black tracking-[0.3em] uppercase">ISA | Integrated Strength Athletes</div>
        <button
          onClick={() => setPage('assessment')}
          className="text-xs font-black tracking-widest uppercase hover:text-isa-canary transition-colors"
        >
          Apply
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-6 md:px-16 max-w-7xl mx-auto overflow-hidden">
        {/* Keep original hero content... */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black leading-[0.9] md:leading-[0.8] tracking-tighter uppercase italic">
          <span className="block">Andrés</span>
          <span className="text-isa-canary not-italic block">Sotomayor</span>
        </h1>
      </section>

      {/* Rest of home page... (keep original sections) */}

      {/* Update the CTA buttons to route to assessment */}
      {/* Change href="https://www.trainerize.me/..." to onClick={() => setPage('assessment')} */}
    </div>
  );
}
