// pages/Tracking.js

import { useState } from "react";
import NavbarSection from "@/components/NavbarSection";
import FooterSection from "@/components/FooterSection";
import FooterTwoSection from "@/components/FooterTwoSection";
import TrackingDisplay from "@/components/TrackingDisplay";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export default function Tracking() {
  const [trackingCode, setTrackingCode] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTrackingData = async () => {
    if (!trackingCode.trim()) {
      setError("Proszę wprowadzić numer dokumentu.");
      setData(null);
      return;
    }

    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentCode: trackingCode }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Wystąpił nieznany błąd.");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message || "Nie udało się pobrać danych śledzenia.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <NavbarSection />

      {/* Główna sekcja śledzenia */}
      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-3xl p-8 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-200 mb-8">
            Śledzenie Przesyłki
          </h2>

          {/* Formularz śledzenia */}
          <div className="flex items-center w-full max-w-md mx-auto bg-gray-800 border border-gray-700 rounded-lg">
            <div className="p-3">
              <Search className="text-gray-500" size={24} />
            </div>
            <input
              type="text"
              placeholder="Wprowadź numer paczki"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              className="flex-grow p-3 bg-transparent text-gray-300 focus:outline-none"
            />
            <button
              onClick={fetchTrackingData}
              className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-r-lg transition-all duration-300"
            >
              Śledź
            </button>
          </div>

          {/* Komunikaty */}
          {loading && (
            <div className="mt-6 flex flex-col items-center">
              {/* Spinner */}
              <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
              <p className="text-gray-300 mt-4">Ładowanie...</p>
            </div>
          )}
          {error && (
            <div className="mt-6 p-4 bg-red-600 border-2 border-red-800 text-white font-semibold rounded-lg shadow-lg">
              {error}
            </div>
          )}

          {/* Wyświetlanie danych śledzenia */}
          {data && (
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <TrackingDisplay data={data} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Footery */}
      <FooterSection />
      <FooterTwoSection />
    </div>
  );
}
