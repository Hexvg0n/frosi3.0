import React from "react";
import { FaTelegramPlane, FaShareAlt, FaDiscord } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

export default function FooterSection() {
  return (
    <footer className="bg-transparent text-white py-6 border-t-2 border-b-2 border-gray-500 z-90">
      <div className="container mx-auto flex justify-center flex-wrap space-x-4">
        <a
          href="https://www.tiktok.com/@frosiakr3ps"
          target="_blank"
          rel="noopener noreferrer"
          className="text-3xl transition-all relative group"
        >
          <SiTiktok className="  text-white hover:text-[#ff0050] transition-colors duration-300" />
        </a>
        <a
          href="https://t.me/frosireps/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-3xl hover:text-blue-500 transition-colors duration-300"
        >
          <FaTelegramPlane />
        </a>
        <a
          href="https://beacons.ai/frosi"
          className="text-3xl hover:text-gray-400 transition-colors duration-300"
        >
          <FaShareAlt />
        </a>
        <a
          href="https://discord.gg/frosireps"
          target="_blank"
          rel="noopener noreferrer"
          className="text-3xl hover:text-indigo-500 transition-colors duration-300"
        >
          <FaDiscord />
        </a>
      </div>
    </footer>
  );
}

