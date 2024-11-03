import React, { useState, useEffect } from "react";

export default function MainSection() {
  const [counter1, setCounter1] = useState(0);
  const [counter2, setCounter2] = useState(0);
  const [counter3, setCounter3] = useState(0);

  useEffect(() => {
    const incrementCounters = () => {
      const interval1 = setInterval(() => {
        setCounter1((prev) => {
          if (prev < 24000) return prev + 200;
          clearInterval(interval1);
          return 24000;
        });
      }, 5);

      const interval2 = setInterval(() => {
        setCounter2((prev) => {
          if (prev < 1000) return prev + 10;
          clearInterval(interval2);
          return 1000;
        });
      }, 10);

      const interval3 = setInterval(() => {
        setCounter3((prev) => {
          if (prev < 30000) return prev + 200; // Zwiększenie wartości inkrementacji
          clearInterval(interval3);
          return 30000;
        });
      }, 5); // Ustawienie bardziej realistycznego interwału
    };

    incrementCounters();
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center h-[80vh] text-white p-24 border-gray-500 md:mt-0 mt-[8vh]"
      style={{ backgroundColor: "transparent", zIndex: 10 }}
    >
      <img
        src="/images/logo.png"
        alt="Logo"
        className="h-full max-h-[35vh]  object-contain mb-12 transition-all duration-300 hover:scale-110"
      />
      <h1 className="text-5xl font-bold mb-4 text-center">
        Jedyna strona której potrzebujesz
      </h1>
      <p className="text-3xl mb-4 text-center">
        Kod <span className="font-bold">"fros100"</span> na -15$
      </p>
      <div className="flex justify-center space-x-6 md:space-x-16 mt-10 md:mt-16">
        <div className="text-center">
          <p className="text-xl md:text-4xl font-bold">+{counter1}</p>
          <p className="text-lg">Użytkowników discord</p>
        </div>
        <div className="text-center">
          <p className="text-xl md:text-4xl font-bold">+{counter2}</p>
          <p className="text-lg">Przedmiotów na stronie</p>
        </div>
        <div className="text-center">
          <p className="text-xl md:text-4xl font-bold">+{counter3}</p>
          <p className="text-lg">Użytkowników naszej strony</p>
        </div>
      </div>
    </div>
  );
}