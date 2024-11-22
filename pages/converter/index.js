// components/Converter.js

import FooterSection from "@/components/FooterSection";
import FooterTwoSection from "@/components/FooterTwoSection";
import NavbarSection from "@/components/NavbarSection";
import axios from 'axios';
import { useState } from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Converter() {
  const [convertedUrls, setConvertedUrls] = useState({});
  const [isCooldown, setIsCooldown] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Mapa agentów do linków obrazków
  const agentImages = {
    superbuy: '/images/agents/superbuy.png',
    cssbuy: '/images/agents/cssbuy.png',
    sugargoo: '/images/agents/sugargoo.png',
    allchinabuy: 'images/logo_allchinabuy.png',
    cnfans: '/images/agents/cnfans.png',
    kakobuy: '/images/agents/kakobuy.png',
    basetao: '/images/agents/basetao.png',
    mulebuy: '/images/agents/mulebuy.png',
    lovegobuy: '/images/agents/lovegobuy.png',
    joyabuy: '/images/agents/joyabuy.png',
    hoobuy: '/images/agents/hoobuy.png' 
  };

  const handleConvert = async () => {
    if (isCooldown) {
      return;
    }

    const url = document.querySelector('input').value.trim();

    if (!url) {
      setErrorMessage('Proszę wprowadzić poprawny link.');
      setConvertedUrls({});
      return;
    }

    try {
      const response = await axios.post(
        '/api/convert',
        { url },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log("API Response:", response.data);

      if (Object.keys(response.data).length === 0) {
        setErrorMessage('Nie znaleziono wyników dla podanego linku.');
        setConvertedUrls({});
      } else {
        setConvertedUrls(response.data);
        setErrorMessage('');
      }

      setIsCooldown(true);
      setTimeout(() => {
        setIsCooldown(false);
      }, 5000);

    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      setConvertedUrls({});
      setErrorMessage('Wystąpił błąd podczas konwertowania linku.');
    }
  };

  return (
    <>
      <NavbarSection />
      <div className="flex flex-col items-center justify-start min-h-full pt-20 pb-20">
        <div className="flex items-center w-full max-w-md shadow-lg border border-gray-700 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 rounded-lg">
          <div className="p-3">
            <LinkIcon className="text-gray-500" size={24} />
          </div>
          <input
            type="text"
            placeholder="Wprowadź link"
            className="flex-grow p-3 bg-transparent text-gray-300 focus:outline-none"
          />
          <button
            onClick={handleConvert}
            className={`p-3 ${
              isCooldown ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
            } text-white font-semibold rounded-r-lg transition-all duration-300`}
            disabled={isCooldown}
          >
            Konwertuj
          </button>
        </div>
        {errorMessage && (
          <div className="mt-4 p-4 bg-red-600 border-2 border-red-800 text-white font-semibold rounded-lg shadow-lg">
            {errorMessage}
          </div>
        )}
        <div className="mt-8 flex flex-wrap gap-4 justify-center max-w-6xl mx-auto">
          {convertedUrls.original && (
            <div className="bg-green-700 bg-opacity-70 text-white font-semibold rounded-lg shadow-lg p-4 w-full flex items-center gap-2">
              🔗 <span>Oryginalny link:</span>
              <a href={convertedUrls.original} target="_blank" rel="noopener noreferrer" className="underline">
                {convertedUrls.original}
              </a>
            </div>
          )}
          {Object.entries(convertedUrls)
            .filter(([key]) => key !== 'original')
            .map(([agent, url], index) => (
              <motion.button
                key={index}
                onClick={() => window.open(url, '_blank')}
                className="bg-gray-800 text-gray-300 font-semibold rounded-lg shadow-lg p-4 flex flex-col items-center gap-2 hover:bg-gray-700 transition-all duration-300 w-48"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={agentImages[agent]}
                  alt={`${agent} logo`}
                  className="w-12 h-12 object-contain"
                />
                <span>{agent.charAt(0).toUpperCase() + agent.slice(1)}</span>
              </motion.button>
          ))}
        </div>
      </div>
      <FooterSection />
      <FooterTwoSection />
    </>
  );
}
