// pages/Tracking.js
import { useState } from "react";
import NavbarSection from "@/components/NavbarSection";
import FooterSection from "@/components/FooterSection";
import FooterTwoSection from "@/components/FooterTwoSection";
import TrackingDisplay from "@/components/TrackingDisplay";

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
        <div className="w-full max-w-3xl p-8 bg-gray-800 bg-opacity-80 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-300 mb-6">
            Śledzenie Przesyłki
          </h2>

          {/* Formularz śledzenia */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              placeholder="Wprowadź numer paczki"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-600 bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
            />
            <button
              onClick={fetchTrackingData}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            >
              Śledź
            </button>
          </div>

          {/* Komunikaty */}
          {loading && <p className="text-gray-300 mt-4">Ładowanie...</p>}
          {error && <div className="text-red-500 mt-4">{error}</div>}

          {/* Wyświetlanie danych śledzenia */}
          {data && (
            <div className="mt-6">
              <TrackingDisplay data={data} />
            </div>
          )}
        </div>
      </div>

      {/* Footery */}
      <FooterSection />
      <FooterTwoSection />
    </div>
  );
}
