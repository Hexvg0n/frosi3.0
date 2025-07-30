import { motion } from 'framer-motion';
import { FaDiscord, FaEye } from 'react-icons/fa';
import { RiTiktokLine } from 'react-icons/ri';

export default function AboutSection() {
  return (
    <div className="relative py-24 px-4">
      {/* Gradient Background */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div 
          className="absolute w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_60%)]"
          style={{ 
            top: '70%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)' 
          }}
        />
      </div>

      {/* Główna zawartość */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div 
          className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Sekcja z obrazem */}
            <motion.div 
              className="relative group md:w-1/2"
              whileHover="hover"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img
                src="/images/about.png"
                className="rounded-2xl border-2 border-white/10 w-full h-full object-cover"
                alt="Frosi aka Rudy"
              />
              
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/60 backdrop-blur-sm flex items-center justify-center rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                variants={{
                  hover: { opacity: 1 },
                  initial: { opacity: 0 }
                }}
              >
                <div className="text-center space-y-6 p-4">
                  <motion.div 
                    className="flex items-center gap-3 text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <FaDiscord className="w-8 h-8 text-gray-300" />
                    <span className="text-lg">+27 500 osób na Discordzie</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-3 text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <RiTiktokLine className="w-8 h-8 text-gray-300" />
                    <span className="text-lg">+100k like'ów na TikToku</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-3 text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <FaEye className="w-8 h-8 text-gray-300" />
                    <span className="text-lg">+1M wyświetleń</span>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Sekcja tekstowa */}
            <div className="md:w-1/2 space-y-6">
              <motion.h1
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-400 to-white bg-clip-text text-transparent"
              >
                Frosi aka Rudy
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg leading-relaxed text-gray-300"
              >
                Jestem jednym z pierwszych polskich twórców treści o tematyce chińskich agentów oraz pierwszym polskim promotorem HagoBuy (dzisiaj KakoBuy). Śledzę świat mody próbując odnaleźć najlepsze ubrania pasujące do każdego obecnie noszonego stylu. W ciągu ostatniego roku intensywnie badałem świat replik, eksperymentując z różnymi agentami i sprzedawcami, gromadząc dużą kolekcję obejmującą wiele kategorii.
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}