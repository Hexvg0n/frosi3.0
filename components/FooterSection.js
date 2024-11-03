import React from "react";
import { FaTiktok, FaTelegramPlane, FaShareAlt, FaDiscord } from "react-icons/fa";

export default function FooterSection() {
  return (
    <footer className="bg-transparent text-white py-6 border-t-2 border-b-2 border-gray-500">
      <div className="container mx-auto flex justify-center flex-wrap space-x-4">
        <a href="https://www.tiktok.com/@frosiakr3ps" target="_blank" rel="noopener noreferrer" className="text-3xl hover:text-gray-400 transition-all">
          <FaTiktok />
        </a>
        <a href="https://t.me/frosireps/" target="_blank" rel="noopener noreferrer" className="text-3xl hover:text-gray-400 transition-all">
          <FaTelegramPlane />
        </a>
        <a href="https://beacons.ai/frosi" className="text-3xl hover:text-gray-400 transition-all">
          <FaShareAlt />
        </a>
        <a href="https://discord.gg/frosireps" target="_blank" rel="noopener noreferrer" className="text-3xl hover:text-gray-400 transition-all">
          <FaDiscord />
        </a>
      </div>
    </footer>
  );
}