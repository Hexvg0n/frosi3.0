"use client";
import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { motion, useMotionValue } from "framer-motion";
import { useSpring, animated } from '@react-spring/web';

// Utility functions
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function generateOneStar() {
  return {
    id: Date.now() + Math.random(),
    column: Math.floor(Math.random() * 14) + 1,
    animationDuration: Math.random() * 3 + 2,
    size: Math.random() * 2 + 1,
    color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`,
    animationDelay: Math.random() * 5,
  };
}

function generateBlotches() {
  return [
    {
      id: 1,
      top: 20,
      left: 15,
      size: 300,
      color: 'rgba(255,255,255)',
      animationDelay: 0
    },
    {
      id: 2,
      top: 30,
      left: 45,
      size: 400,
      color: 'rgba(255,255,255)',
      animationDelay: 0.5
    },
    {
      id: 3,
      top: 10,
      left: 75,
      size: 350,
      color: 'rgba(255,255,255)',
      animationDelay: 1
    }
  ];
}


function FallingStar({ star }) {
  return (
    <motion.div
      className="absolute pointer-events-none rounded-full opacity-90 z-10"
      style={{
        left: `calc(${(star.column - 1) * (100 / 14)}% + ${(100 / 14 - star.size * 4) / 2}px)`,
        width: `${star.size * 4}px`,
        height: `${star.size * 4}px`,
        backgroundColor: star.color,
        boxShadow: "0 0 10px 3px rgba(255, 255, 255, 0.8)",
      }}
      initial={{ y: "-20px" }}
      animate={{ y: "100vh" }}
      transition={{
        duration: star.animationDuration,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
        delay: star.animationDelay,
      }}
    />
  );
}

function Blotch({ blotch }) {
  return (
    <div
      className="absolute pointer-events-none blur-3xl"
      style={{
        top: `${blotch.top}%`,
        left: `${blotch.left}%`,
        width: `${blotch.size}px`,
        height: `${blotch.size}px`,
        borderRadius: "9999px",
        backgroundColor: blotch.color,
        opacity: 0.05,
        zIndex: 5,
      }}
    />
  );
}



export default function MainSection() {
  const [fallingStars, setFallingStars] = useState([]);
  const randomBlotches = useMemo(() => generateBlotches(), []);
  const [itemWidth, setItemWidth] = useState(500);
  const containerRef = useRef(null);

  const images = [
    "/images/agents/basetao.png",
    "/images/agents/kakobuy.png",
    "/images/agents/cnfans.png",
    "/images/agents/mulebuy.png",
    "/images/agents/joyabuy.png",
  ];

  const x = useMotionValue(0);
  const hoveredRef = useRef(false);
  const rafRef = useRef(null);
  const speed = 100;
  const oneSetWidth = images.length * (itemWidth + 30);

  useEffect(() => {
    const initialStars = Array.from({ length: 4 }, generateOneStar);
    setFallingStars(initialStars);

    const interval = setInterval(() => {
      setFallingStars(prev => {
        const newStars = prev.length >= 4 ? [...prev.slice(1)] : [...prev];
        return [...newStars, generateOneStar()];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      const width = entries[0].contentRect.width;
      setItemWidth(width < 768 ? 300 : 500);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateLoop = useCallback((timestamp) => {
    if (!rafRef.current) {
      rafRef.current = timestamp;
    }
    const dt = timestamp - rafRef.current;
    rafRef.current = timestamp;

    if (!hoveredRef.current) {
      const dist = speed * (dt / 1000);
      let currentX = x.get();
      let nextX = currentX - dist;

      if (nextX <= -oneSetWidth) {
        nextX += oneSetWidth;
      }
      x.set(nextX);
    }
    requestAnimationFrame(animateLoop);
  }, [oneSetWidth, speed, x]);

  useEffect(() => {
    rafRef.current = null;
    const animationId = requestAnimationFrame(animateLoop);
    return () => cancelAnimationFrame(animationId);
  }, [animateLoop]);

  return (
    <section ref={containerRef} className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col items-center">
      <div
        className="absolute inset-0 bg-grid-pattern pointer-events-none z-10"
        style={{ backgroundSize: "180px 180px" }}
      />

      {randomBlotches.map((blotch) => (
        <Blotch key={blotch.id} blotch={blotch} />
      ))}

      {fallingStars.map((star) => (
        <FallingStar key={star.id} star={star} />
      ))}

<motion.div
  className="rounded-full py-3 px-10 text-gray-300 text-lg mt-40 mb-20 flex flex-row items-center bg-gradient-radial from-zinc-700 via-zinc-800 to-zinc-900 shadow-xl "
  initial={{ y: -20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.6 }}
>
  <img src="/images/kakobuy-icon.png" className="h-6 pr-2"></img>
  Oficjalny partner
</motion.div>
      <div className="flex-1 flex flex-col items-center justify-start max-w-5xl text-center px-4 my-16 space-y-12">
        <motion.h1
          className="text-4xl md:text-7xl font-semibold pb-8 leading-tight bg-gradient-to-r from-gray-400 to-white bg-clip-text text-transparent"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Jedyna Platforma W2C
          <br />
          Której Potrzebowałeś
        </motion.h1>

        <motion.p
          className="text-gray-400 text-lg md:text-xl mb-16 max-w-2xl leading-relaxed"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Frosireps to najstarsze polskie community, które spopularyzowało temat replik 
          w Polsce i odkryło do dziś najlepszego agenta, czyli KakoBuy. 
          Dokładamy wszelkich starań, abyś doznał jak najlepszych wrażeń 
          i jakości podczas zamawiania z Chin.
        </motion.p>

        <motion.button
          className="px-8 py-4 bg-white text-black rounded-full font-semibold text-lg shadow-lg hover:bg-gray-200 transition-colors mb-24 z-20"
          role="button"
          aria-label="Rozpocznij korzystanie z platformy"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Zaczynamy
        </motion.button>
      </div>

      <div className="relative w-full mt-32">
        <div
          className="absolute bottom-0 w-[150%] left-1/2 transform -translate-x-1/2  pointer-events-none"
          style={{
            height: "30vh",
            background: `
              radial-gradient(
                ellipse at 50% 100%,
                rgba(0,0,0,1) 0%,
                rgba(0,0,0,0.9) 40%,
                rgba(255,255,255,0.3) 90%,
                rgba(255,255,255,0) 100%
              )
            `,
            borderTopLeftRadius: "50%",
            borderTopRightRadius: "50%",
          }}
        >
          <div
            className="absolute top-0 w-full h-full"
            style={{
              boxShadow: `
                0 -4px 30px 4px rgba(255,255,255,0.2),
                0 -2px 15px 2px rgba(255,255,255,0.15)
              `,
              borderTopLeftRadius: "50%",
              borderTopRightRadius: "50%",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(4px)",
            }}
          />
        </div>
      </div>
    </section>
  );
}