import { motion } from 'framer-motion';
import { GrFormView } from "react-icons/gr";
import { FaDiscord } from "react-icons/fa";
import { RiTiktokLine } from "react-icons/ri";
// Uncomment the next line if using Next.js Image component
// import Image from 'next/image'; 

export default function AboutSection() {
  // Animation variants for the section
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    },
  };

  // Animation variants for the text content
  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    },
  };

  // Animation variants for icons
  const iconVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    },
  };

  return (
    <motion.section
      className="bg-transparent py-12 px-4 border-t-2 border-gray-500"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center">
        {/* Image Container */}
        <motion.div
          className="md:w-1/2 mb-6 md:mb-0 relative group"
          variants={sectionVariants}
        >
          {/* Using Next.js Image for Optimization (Optional) */}
          {/*
          <Image
            src="/images/about.png"
            alt="Frosi aka Rudy"
            layout="responsive"
            width={500}
            height={500}
            className="w-full h-auto rounded-lg shadow-lg transition-transform duration-500 ease-in-out transform group-hover:scale-105"
          />
          */}
          
          {/* If not using Next.js Image, use standard img tag */}
          <img
            src="/images/about.png"
            alt="Frosi aka Rudy"
            className="w-full h-auto rounded-lg shadow-lg transition-transform duration-500 ease-in-out transform group-hover:scale-105"
          />

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none transition-transform duration-500 ease-in-out transform group-hover:scale-105"
          >
            <div className="text-white text-xl flex flex-col items-center space-y-4">
              <motion.div 
                variants={iconVariants} 
                initial="hidden" 
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="flex items-center space-x-2"
              >
                <FaDiscord className="text-5xl" />
                <span>+24 400 osób na Discordzie</span>
              </motion.div>
              <motion.div 
                variants={iconVariants} 
                initial="hidden" 
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="flex items-center space-x-2"
              >
                <RiTiktokLine className="text-5xl" />
                <span>+61k like'ów na TikToku</span>
              </motion.div>
              <motion.div 
                variants={iconVariants} 
                initial="hidden" 
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="flex items-center space-x-2"
              >
                <GrFormView className="text-5xl" />
                <span>+1M wyświetleń</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          className="md:w-1/2 md:pl-8 text-center md:text-left text-white"
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h1 className="text-4xl font-bold mb-6">Frosi aka Rudy</h1>
          <p className="text-lg">
          Jestem jednym z pierwszych polskich twórców treści o tematyce chińskich agentów oraz pierwszym polskim promotorem  HagoBuy (dzisiaj KakoBuy). Śledzę świat mody próbując odnaleźć najlepsze ubrania pasujące do każdego obecnie noszonego stylu. W ciągu ostatniego roku intensywnie badałem świat replik, eksperymentując z różnymi agentami i sprzedawcami, gromadząc dużą kolekcję obejmującą wiele kategorii.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
