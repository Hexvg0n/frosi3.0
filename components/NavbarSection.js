import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NavbarSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [isW2COpen, setIsW2COpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { name: "HOME", href: "/" },
    { 
      name: "W2C", 
      href: "/w2c", 
      dropdown: [
        { name: "Items", href: "/w2c/items" },
        { name: "Spreadsheet", href: "/w2c" },
      ] 
    },
    { name: "QC FINDER", href: "/qc" },
    { name: "CONVERTER", href: "/converter" },
    { name: "TRACKING", href: "/tracking" },
    { name: "ADMIN", href: "/admin" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-[10vh] flex items-center xl:justify-around md:justify-between p-4 mb-10"
      style={{
        background: "rgba(0, 0, 0, 0.25)",
        position: "fixed",
        width: "100%",
        top: 0,
        zIndex: 11,
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <a href="/" className="block">
        <motion.img
          src="/images/logo.png"
          alt="Logo"
          className="h-full max-h-[8vh] object-contain"
          whileHover={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
      </a>

      <div className="lg:hidden flex items-center justify-end flex-grow">
        <motion.button
          className="text-black focus:outline-none p-4"
          onClick={toggleMenu}
          style={{ position: "absolute", top: 0, right: 0, zIndex: 100 }}
          whileHover={{ scale: 1.1 }}
        >
          <span className="text-white text-5xl font-bold">☰</span>
        </motion.button>
      </div>

      <nav
        className={`lg:relative lg:transform-none lg:h-auto lg:bg-transparent lg:w-auto lg:flex lg:items-center`}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-screen w-full bg-black/95 p-4 z-40"
              style={{ backdropFilter: "blur(16px)" }}
            >
              <div className="flex flex-col space-y-6 items-center justify-center h-full">
                {navItems.map((item) => (
                  <motion.div
                    key={item.name}
                    whileHover={{ scale: 1.05 }}
                    className="relative group"
                  >
                    <a
                      href={item.href}
                      className="text-2xl text-white font-bold px-6 py-3 relative"
                    >
                      {item.name}
                      <span className="absolute bottom-2 left-0 w-full h-[2px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </a>
                  </motion.div>
                ))}
                <div className="flex flex-col space-y-4 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    <a href="https://discord.gg/invite/frosireps" target="_blank">
                      DISCORD
                    </a>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    <a href="https://ikako.vip/r/frosireps" target="_blank">
                      Zarejestruj się
                    </a>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="hidden lg:flex space-x-8 items-center">
          {navItems.map((item) => (
            <motion.div
              key={item.name}
              className="relative group"
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => item.dropdown && setIsW2COpen(true)}
              onHoverEnd={() => item.dropdown && setIsW2COpen(false)}
            >
              <a
                href={item.href}
                className="text-white font-medium px-4 py-2 relative"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </a>
              {item.dropdown && isW2COpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg"
                >
                  {item.dropdown.map((dropdownItem) => (
                    <a
                      key={dropdownItem.name}
                      href={dropdownItem.href}
                      className="block px-4 py-2 text-white hover:bg-gray-700/80 rounded-lg"
                    >
                      {dropdownItem.name}
                    </a>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
          <div className="flex space-x-4 ml-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-6 py-2  bg-blue-500  rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <a href="https://discord.gg/invite/frosireps" target="_blank">
                DISCORD
              </a>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-6 py-2  bg-red-600  rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <a href="https://ikako.vip/r/frosireps" target="_blank">
                Zarejestruj się
              </a>
            </motion.button>
          </div>
        </div>
      </nav>
    </motion.div>
  );
}