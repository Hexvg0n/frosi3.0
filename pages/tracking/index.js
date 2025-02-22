// pages/tracking.js
import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Clock, AlertCircle } from 'lucide-react';
import NavbarSection from "@/components/NavbarSection";
import FooterSection from "@/components/FooterSection";
import FooterTwoSection from "@/components/FooterTwoSection";
import TrackingDisplay from "@/components/TrackingDisplay";

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

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackingData, setTrackingData] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Proszę wprowadzić numer śledzenia');
      return;
    }

    setIsLoading(true);
    setError('');
    setTrackingData(null);

    try {
      const response = await axios.post('/api/tracking', {
        documentCode: trackingNumber.trim()
      });

      if (response.data.error) throw new Error(response.data.error);
      setTrackingData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Nie udało się pobrać danych śledzenia');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 relative overflow-hidden">
    <div className="h-[10vh]"/>

      <GradientBackground />
      <NavbarSection />

      <main className="max-w-7xl mx-auto px-4 py-20 relative z-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <GlassCard>
            <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
              Śledzenie Przesyłki
            </h1>
              <form onSubmit={handleTrack} className="mb-8">
                <div className="relative flex items-center gap-4">
                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-2xl rounded-3xl -z-10" />

                  {/* Input field */}
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Wprowadź numer śledzenia..."
                    className="w-full p-4 bg-gray-900/50 backdrop-blur-lg border-2 border-white/10 rounded-2xl focus:outline-none focus:border-purple-500/50 transition-all font-medium"
                  />

                  {/* Przycisk z poprawionym pozycjonowaniem */}
                  <div className="relative z-20">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`px-8 py-4 rounded-2xl font-semibold transition-all ${
                        isLoading ? 'bg-gray-700/50 cursor-not-allowed' 
                        : 'bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500'
                      }`}
                    >
                      {isLoading ? 'Wyszukiwanie...' : 'Śledź'}
                    </button>
                  </div>
                </div>
              </form>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 mb-6 bg-red-700/30 border-2 border-red-600/50 rounded-xl flex items-center gap-3"
              >
                <AlertCircle className="text-red-400" />
                <span>{error}</span>
              </motion.div>
            )}

            {isLoading && (
              <div className="py-8 flex flex-col items-center gap-4 text-purple-400">
                <Clock className="w-12 h-12 animate-pulse" />
                <span>Ładowanie danych śledzenia...</span>
              </div>
            )}
          </GlassCard>

          {trackingData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8"
            >
              <TrackingDisplay data={trackingData} />
            </motion.div>
          )}
        </motion.div>
      </main>

      <FooterSection />
      <FooterTwoSection />
    </div>
  );
}