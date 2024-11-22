import React, { useState } from "react";

export default function NavbarSection() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="h-[10vh] flex items-center xl:justify-around md:justify-between p-4"
      style={{
        backgroundColor: "transparent",
        marginTop: "1.5vh",
        position: "relative",
        zIndex: 40,
      }}
    >
      <a href="/" className="block">
        <img
          src="/images/logo.png"
          alt="Logo"
          className="h-full max-h-[8vh] object-contain transition-all duration-300 hover:scale-90"
        />
      </a>
      <div className="lg:hidden flex items-center justify-end flex-grow">
        <button
          className="text-black focus:outline-none p-4"
          onClick={toggleMenu}
          style={{ position: "absolute", top: 0, right: 0, zIndex: 100 }}
        >
          <span className="text-white text-5xl font-bold">☰</span>
        </button>
      </div>
      <nav
        className={`fixed top-0 left-0 h-screen w-full bg-black p-4 transition-transform duration-300 ease-in-out z-50 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:transform-none lg:h-auto lg:bg-transparent lg:w-auto lg:flex lg:items-center`}
      >
        <div
          className={`flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-6 lg:items-center`}
        >
          <button className="text-white hover:shadow-lg transition-all duration-300 p-4 lg:p-2 relative group font-bold">
            <a href="/">HOME</a>
            <span className="block absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button className="text-white hover:drop-shadow-xl transition-all duration-300 p-4 lg:p-2 relative group font-bold">
            <a href="/w2c">W2C</a>
            <span className="block absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button className="text-white hover:shadow-lg transition-all duration-300 p-4 lg:p-2 relative group font-bold">
            <a href="/qc">QC FINDER</a>
            <span className="block absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button className="text-white hover:shadow-lg transition-all duration-300 p-4 lg:p-2 relative group font-bold">
            <a href="/converter">CONVERTER</a>
            <span className="block absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </button>
          {/* <button className="text-white hover:shadow-lg transition-all duration-300 p-4 lg:p-2 relative group font-bold">
            <a href="/finder">ITEM FINDER</a>
            <span className="block absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </button> */}
          <button className="text-white hover:shadow-lg transition-all duration-300 p-4 lg:p-2 relative group font-bold">
            <a href="/tracking">TRACKING</a>
            <span className="block absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button className="text-blue-500 hover:shadow-lg transition-all duration-300 border border-blue-500 rounded-lg px-6 py-2 lg:px-4 lg:py-2 hover:bg-blue-500 hover:text-white font-bold">
            <a href="https://discord.gg/invite/frosireps" target="_blank">DISCORD</a>
          </button>
          <button className="text-red-600 hover:shadow-lg transition-all duration-300 border border-red-600 rounded-lg px-6 py-2 lg:px-4 lg:py-2 hover:bg-red-600 hover:text-white font-bold">
            <a href="https://ikako.vip/r/frosireps" target="_blank">Zarejestruj się</a>
          </button>
        </div>
      </nav>
    </div>
  );
}
