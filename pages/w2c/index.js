// pages/w2c/index.js
import React from 'react';
import NavbarSection from "@/components/NavbarSection";
import FooterSection from "@/components/FooterSection";
import FooterTwoSection from "@/components/FooterTwoSection";

const GradientBackground = () => (
  <div className="fixed inset-0 z-0 opacity-30">
    <div 
      className="absolute w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,#4F46E5_0%,transparent_60%)]"
      style={{
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        animation: 'gradient-pulse 15s infinite alternate'
      }}
    />
    <style jsx global>{`
      @keyframes gradient-pulse {
        0% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
        50% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.2); }
        100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
      }
    `}</style>
  </div>
);

const W2C = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 relative overflow-hidden">
      <div className="h-[10vh]"/>
      <GradientBackground />
      <NavbarSection className="z-40" />

      <main className="max-w-full mx-auto px-2 sm:px-4 py-4 sm:py-8 relative z-10">
        <div className="flex flex-col items-center">
          <div className="w-full bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-black/30 mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
              Baza produktów W2C
            </h1>
            <p className="text-gray-400 text-center mb-6">
              Poniżej znajduje się pełna lista produktów z naszego arkusza Google
            </p>
          </div>

          <div className="w-full h-[70vh] bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl border border-white/10 rounded-3xl p-0 overflow-hidden shadow-2xl shadow-black/30">
            <iframe 
              src="https://docs.google.com/spreadsheets/d/14ht5PB1IJOaiA4yC3iVORbglyQ0zJ42nFqRr1KUJej8/edit?gid=1363234293#gid=1363234293" 
              className="w-full h-full border-0"
              title="W2C Spreadsheet"
            ></iframe>
          </div>
        </div>
      </main>

      <FooterSection />
      <FooterTwoSection />
    </div>
  );
};

export default W2C;