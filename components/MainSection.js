import React, { useState, useEffect } from "react";

export default function MainSection() {
  const [counter1, setCounter1] = useState(0);
  const [counter2, setCounter2] = useState(0);
  const [counter3, setCounter3] = useState(0);

  useEffect(() => {
    const incrementCounters = () => {
      const interval1 = setInterval(() => {
        setCounter1((prev) => {
          if (prev < 25500) return prev + 200;
          clearInterval(interval1);
          return 25500;
        });
      }, 5);

      const interval2 = setInterval(() => {
        setCounter2((prev) => {
          if (prev < 1500) return prev + 10;
          clearInterval(interval2);
          return 1500;
        });
      }, 15);

      const interval3 = setInterval(() => {
        setCounter3((prev) => {
          if (prev < 30000) return prev + 200;
          clearInterval(interval3);
          return 30000;
        });
      }, 5);
    };

    incrementCounters();
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center text-white p-4 md:p-24 border-gray-500 md:mt-0 mt-8 mb-12"
      style={{ backgroundColor: "transparent", zIndex: 10 }}
    >
      <img
        src="/images/logo.png"
        alt="Logo"
        className="w-40 h-40 md:w-[500px] md:h-[500px] object-contain mb-12 transition-transform duration-300 hover:scale-110"
      />
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center">
        Jedyna strona której potrzebujesz
      </h1>
      <p className="text-xl md:text-3xl mb-4 text-center">
        Kod <span className="font-bold">"Fro100"</span> na -100 CNY 
      </p>
      <div className="flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 space-x-0 md:space-x-16 mt-10 md:mt-16">
        <div className="text-center">
          <p className="text-lg md:text-4xl font-bold">+{counter1}</p>
          <p className="text-md md:text-lg">Użytkowników Discord</p>
        </div>
        <div className="text-center">
          <p className="text-lg md:text-4xl font-bold">+{counter2}</p>
          <p className="text-md md:text-lg">Przedmiotów na stronie</p>
        </div>
        <div className="text-center">
          <p className="text-lg md:text-4xl font-bold">+{counter3}</p>
          <p className="text-md md:text-lg">Użytkowników naszej strony</p>
        </div>
      </div>
    </div>
  );
}
