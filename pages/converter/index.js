import FooterSection from "@/components/FooterSection";
import FooterTwoSection from "@/components/FooterTwoSection";
import NavbarSection from "@/components/NavbarSection";
import axios from 'axios';
import { useState } from 'react';

export default function Converter() {
  const [convertedUrls, setConvertedUrls] = useState({});
  const [isCooldown, setIsCooldown] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const agentEmojis = {
    pandabuy: '🐼',
    superbuy: '🚀',
    cssbuy: '🛍️',
    sugargoo: '🍬',
    allchinabuy: '🐉',
    cnfans: '🉐',
    kakobuy: '♨️',
    basetao:'🅱️',
    mulebuy: '💫',
    lovegobuy: '💚',
    joyabuy:'🛒'
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
        <div className="flex items-center w-full max-w-md shadow-lg border border-gray-300 bg-gray-800 bg-opacity-60 rounded-lg">
          <input
            type="text"
            placeholder="Wprowadź link"
            className="flex-grow p-3 bg-gray-700 bg-opacity-70 text-gray-300 rounded-l-lg"
          />
          <button
            onClick={handleConvert}
            className={`p-3 ${isCooldown ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-600'} bg-opacity-70 text-gray-300 font-semibold rounded-r-lg hover:bg-gray-500 transition-all duration-300`}
            disabled={isCooldown}
          >
            Konwertuj
          </button>
        </div>
        {errorMessage && (
          <div className="mt-4 p-4 bg-red-700 border-2 border-red-900 text-white font-semibold rounded-lg shadow-lg">
            {errorMessage}
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-4 justify-center max-w-6xl mx-auto">
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
              <button
                key={index}
                onClick={() => window.open(url, '_blank')}
                className="bg-gray-700 bg-opacity-70 text-gray-300 font-semibold rounded-lg shadow-lg p-4 flex items-center gap-2 hover:bg-gray-600 transition-all duration-300 w-48"
              >
                {agentEmojis[agent] || '🌐'} {agent.charAt(0).toUpperCase() + agent.slice(1)}
              </button>
          ))}
        </div>
      </div>
      <FooterSection />
      <FooterTwoSection />
    </>
  );
}
