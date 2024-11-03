import React from 'react';

export default function Error404() {
  return (
    <div
      className="flex flex-col items-center justify-center h-[80vh] text-white p-24 border-gray-500 md:mt-0 mt-[8vh]"
      style={{ backgroundColor: "transparent", zIndex: 10, backgroundImage: "url(/images/background.png)" }}
    >
      <h1 className="text-5xl font-bold mb-4 text-center">404</h1>
      <p className="text-3xl mb-4 text-center">Przepraszamy, ta podstrona nie istnieje lub jest w trakcie tworzenia.</p>
      <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all font-bold">
        <a href='/'>Wróć do strony głównej</a>
      </button>
    </div>
  );
}