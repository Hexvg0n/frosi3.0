// pages/qc/index.js
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, AlertCircle, ArrowLeft, ArrowRight, Copy } from "lucide-react";
import axios from "axios";
import NavbarSection from "@/components/NavbarSection";
import FooterSection from "@/components/FooterSection";
import FooterTwoSection from "@/components/FooterTwoSection";
import QCPhotos from "@/components/QCPhotos";

const GradientBackground = () => (
  <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
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
        50% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.1); }
        100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
      }
    `}</style>
  </div>
);

const GlassCard = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/30"
  >
    {children}
  </motion.div>
);

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-4 bg-gray-800 rounded-lg w-3/4" />
    <div className="h-4 bg-gray-800 rounded-lg w-1/2" />
    <div className="h-32 bg-gray-800 rounded-lg" />
  </div>
);

const QCPage = () => {
  const router = useRouter();
  const { url } = router.query;

  const [link, setLink] = useState("");
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const GROUPS_PER_PAGE = 6;
  const totalPages = Math.ceil(groups.length / GROUPS_PER_PAGE);
  const indexOfLastGroup = currentPage * GROUPS_PER_PAGE;
  const indexOfFirstGroup = indexOfLastGroup - GROUPS_PER_PAGE;
  const currentGroups = groups.slice(indexOfFirstGroup, indexOfLastGroup);

  const handleConvertLink = useCallback(async (linkToConvert) => {
    if (!linkToConvert?.trim()) {
      setError("Proszę wprowadzić link do produktu");
      return;
    }

    setIsLoading(true);
    setGroups([]);
    setError("");
    setCurrentPage(1);

    try {
      const source = axios.CancelToken.source();
      const timeout = setTimeout(() => source.cancel('Request timeout'), 10000);

      const response = await axios.post("/api/qcPhotos", { 
        url: linkToConvert 
      }, {
        headers: {
          'X-API-Key': process.env.NEXT_PUBLIC_API_SECRET
        }
      });

      clearTimeout(timeout);

      if (response.data.status === 'error') {
        throw new Error(response.data.message);
      }

      if (response.data.data?.groups?.length > 0) {
        setGroups(response.data.data.groups);
      } else {
        throw new Error("Nie znaleziono zdjęć QC dla tego produktu");
      }
    } catch (err) {
      setError(
        axios.isCancel(err) 
          ? 'Przekroczono czas oczekiwania na odpowiedź'
          : err.response?.data?.message || err.message
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (url && url !== link) {
      setLink(decodeURIComponent(url));
      handleConvertLink(decodeURIComponent(url));
    }
  }, [url, handleConvertLink, link]);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push({
      pathname: '/qc',
      query: { url: encodeURIComponent(link) },
    });
  };

  const handlePagination = (direction) => {
    setCurrentPage(prev => Math.max(1, Math.min(
      direction === 'next' ? prev + 1 : prev - 1, 
      totalPages
    )));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('Link skopiowany do schowka!'))
      .catch(() => alert('Błąd podczas kopiowania linku'));
  };

  useEffect(() => {
    if (groups.length > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [groups.length, currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 relative overflow-hidden">
      <div className="h-[10vh]"/>
      <GradientBackground />
      <NavbarSection />

      <main className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <GlassCard>
            <form onSubmit={handleSearch} className="mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-2xl rounded-xl" />
                <div className="relative flex items-center bg-gray-900/50 backdrop-blur-lg border-2 border-white/10 rounded-xl hover:border-purple-500/30 transition-all">
                  <div className="pl-5 pr-3 text-purple-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Wklej link produktu..."
                    className="w-full p-4 bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none font-medium"
                    aria-label="Link produktu"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`self-stretch px-6 font-semibold transition-all flex items-center rounded-r-lg ${
                      isLoading 
                        ? 'bg-gray-700/50 cursor-not-allowed text-gray-500' 
                        : 'bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white'
                    }`}
                    aria-label={isLoading ? "Przetwarzanie" : "Szukaj"}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : 'Szukaj'}
                  </button>
                </div>
              </div>
            </form>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-red-700/30 border-2 border-red-600/50 rounded-lg flex items-center gap-3 mb-4">
                    <AlertCircle className="text-red-400 flex-shrink-0" />
                    <span className="break-words">{error}</span>
                  </div>
                </motion.div>
              )}

              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 flex flex-col items-center gap-4"
                >
                  <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
                  <span className="text-gray-400">Wyszukiwanie zdjęć QC...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>

          <AnimatePresence>
            {groups.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-12"
              >
                <GlassCard>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence initial={false}>
                      {currentGroups.map((group, index) => (
                        <motion.div
                          key={`${group.variant}-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          <QCPhotos
                            photos={group.photos}
                            variant={group.variant}
                            groupIndex={indexOfFirstGroup + index + 1}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <div className="mt-8 flex flex-col items-center gap-4">
                    {totalPages > 1 && (
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handlePagination('prev')}
                          disabled={currentPage === 1}
                          className={`px-4 py-2 rounded-lg transition-all flex items-center ${
                            currentPage === 1 
                              ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed' 
                              : 'bg-purple-600/30 hover:bg-purple-500/50 text-white'
                          }`}
                          aria-label="Poprzednia strona"
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                        
                        <span className="text-gray-400 text-sm font-mono">
                          Strona {currentPage} z {totalPages}
                        </span>
                        
                        <button
                          onClick={() => handlePagination('next')}
                          disabled={currentPage === totalPages}
                          className={`px-4 py-2 rounded-lg transition-all flex items-center ${
                            currentPage === totalPages 
                              ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed' 
                              : 'bg-purple-600/30 hover:bg-purple-500/50 text-white'
                          }`}
                          aria-label="Następna strona"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}

                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600/30 hover:bg-purple-500/50 text-white rounded-lg transition-all"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Kopiuj link do strony</span>
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      <FooterSection />
      <FooterTwoSection />
    </div>
  );
};

export default QCPage;