// components/Converter.js
import FooterSection from "@/components/FooterSection";
import FooterTwoSection from "@/components/FooterTwoSection";
import NavbarSection from "@/components/NavbarSection";
import axios from 'axios';
import { useState } from 'react';
import { Link as LinkIcon, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Converter() {
  const [convertedUrls, setConvertedUrls] = useState({});
  const [isCooldown, setIsCooldown] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const agentImages = {
    superbuy: '/images/agents/superbuy.png',
    cssbuy: '/images/agents/cssbuy.png',
    sugargoo: '/images/agents/sugargoo.png',
    allchinabuy: '/images/logo_allchinabuy.png',
    cnfans: '/images/agents/cnfans.png',
    kakobuy: '/images/agents/kakobuy.png',
    basetao: '/images/agents/basetao.webp',
    mulebuy: '/images/agents/mulebuy.webp',
    lovegobuy: '/images/agents/lovegobuy.png',
    joyabuy: '/images/agents/joyabuy.webp',
    hoobuy: '/images/agents/hoobuy.png'
  };

  const handleConvert = async () => {
    if (isCooldown || isLoading) return;
    if (!inputUrl.trim()) {
      setErrorMessage('Proszę wprowadzić poprawny link.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      
      const convertResponse = await axios.post('/api/convert', { url: inputUrl.trim() });
      if (!Object.keys(convertResponse.data).length) throw new Error('Nie znaleziono wyników');

      setConvertedUrls(convertResponse.data);

      if (convertResponse.data.kakobuy) {
        try {
          const scraperResponse = await axios.post('/api/scraper', {
            url: convertResponse.data.kakobuy
          });
          setConvertedUrls(prev => ({ ...prev, product: scraperResponse.data }));
        } catch (scrapeError) {
          console.error('Błąd scrapowania:', scrapeError);
        }
      }

      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 5000);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Wystąpił błąd podczas konwertowania linku');
      setConvertedUrls({});
    } finally {
      setIsLoading(false);
    }
  };

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

  const GlassCard = ({ children }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/30"
    >
      {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 relative overflow-hidden">
    <div className="h-[10vh]"/>
      <GradientBackground />
      <NavbarSection />

      <main className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <GlassCard>
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Wklej link produktu..."
                className="w-full p-4 bg-gray-900/50 backdrop-blur-lg border-2 border-white/10 rounded-2xl focus:outline-none focus:border-purple-500/50 transition-all font-medium"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
              />
              <button
                onClick={handleConvert}
                className={`px-6 py-4 rounded-2xl font-semibold transition-all text-center ${
                  isCooldown 
                    ? 'bg-gray-700/50 cursor-not-allowed' 
                    : 'bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500'
                }`}
                disabled={isCooldown}
              >
                {isCooldown ? 'Czekaj...' : 'Konwertuj'}
              </button>
            </div>
          </GlassCard>

          {isLoading && (
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-12 h-12 border-4 border-purple-500/30 rounded-full border-t-purple-500"
              />
            </motion.div>
          )}

          {errorMessage && (
            <GlassCard>
              <div className="flex items-center gap-3 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span>{errorMessage}</span>
              </div>
            </GlassCard>
          )}

          {Object.keys(convertedUrls).length > 0 && (
            <GlassCard>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="aspect-square bg-gray-900/40 backdrop-blur-sm rounded-2xl border-2 border-white/10 overflow-hidden">
                    {convertedUrls.product?.productImage ? (
                      <motion.img
                        src={convertedUrls.product.productImage}
                        alt="Product"
                        className="w-full h-full object-cover"
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        Brak obrazu
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                    {convertedUrls.product?.productTitle || 'Brak tytułu'}
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <DetailCard label="Cena" value={convertedUrls.product?.productPrice} />
                    <DetailCard label="Czas dostawy" value={convertedUrls.product?.arrivalDays} />
                    <DetailCard label="Waga" value={convertedUrls.product?.weight && `${convertedUrls.product.weight}g`} />
                    <DetailCard label="Objętość" value={convertedUrls.product?.volume && `${convertedUrls.product.volume}cm³`} />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-400">Dostępni agenci:</h3>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                      {Object.entries(convertedUrls)
                        .filter(([key]) => !['original', 'product'].includes(key))
                        .map(([agent, url], index) => (
                          <motion.button
                            key={index}
                            onClick={() => window.open(url, '_blank')}
                            className="group relative bg-gray-900/40 backdrop-blur-sm border-2 border-white/10 rounded-xl p-2 flex flex-col items-center gap-2 hover:border-purple-500/30 transition-all"
                            whileHover={{ scale: 1.05 }}
                          >
                            <img
                              src={agentImages[agent]}
                              alt={agent}
                              className="w-8 h-8 object-contain saturate-0 group-hover:saturate-100 transition-all"
                            />
                            <span className="text-xs text-gray-400 group-hover:text-purple-300 transition-colors capitalize">
                              {agent}
                            </span>
                          </motion.button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}
        </motion.div>
      </main>

      <FooterSection />
      <FooterTwoSection />
    </div>
  );
}

const DetailCard = ({ label, value }) => (
  <div className="bg-gray-900/40 backdrop-blur-sm border-2 border-white/10 rounded-xl p-3">
    <span className="text-xs text-purple-400 font-medium">{label}</span>
    <p className="text-sm font-semibold mt-1 text-gray-200">{value || 'N/A'}</p>
  </div>
);