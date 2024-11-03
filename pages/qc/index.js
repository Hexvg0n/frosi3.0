import { useState } from "react";
import NavbarSection from "@/components/NavbarSection";
import FooterSection from "@/components/FooterSection";
import FooterTwoSection from "@/components/FooterTwoSection";
import QCPhotos from "@/components/QCPhotos";
import axios from "axios";

export default function QCPage() {
  const [link, setLink] = useState("");
  const [platform, setPlatform] = useState("");
  const [itemID, setItemID] = useState("");
  const [photos, setPhotos] = useState([]); // Dodajemy stan dla zdjęć
  const [showPhotos, setShowPhotos] = useState(false);
  const [error, setError] = useState("");

  const handleConvertLink = async () => {
    if (!link) {
      alert("Proszę wprowadzić link.");
      return;
    }

    try {
      const response = await axios.post("/api/qcPhotos", { url: link });
      const { photos, error } = response.data;

      if (error) {
        setError(error);
        console.error("Błąd zwrócony z API:", error);
        return;
      }

      if (photos && photos.length > 0) {
        setPhotos(photos); // Ustawiamy zdjęcia w stanie
        setShowPhotos(true);
        setError("");
      } else {
        setError("Nie udało się pobrać zdjęć dla podanego linku.");
      }
    } catch (err) {
      console.error("Błąd podczas pobierania zdjęć:", err.message);
      setError("Wystąpił błąd podczas pobierania zdjęć.");
    }
  };

  return (
    <>
      <NavbarSection />
      <div className="flex flex-col items-center justify-start min-h-full pt-20 pb-20">
        <div className="flex items-center w-full max-w-md shadow-lg border border-gray-300 bg-gray-800 bg-opacity-60 rounded-lg p-5">
          <input
            type="text"
            placeholder="Wprowadź link do produktu"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="flex-grow p-3 bg-gray-700 bg-opacity-70 text-gray-300 rounded-l-lg"
          />
          <button
            onClick={handleConvertLink}
            className="p-3 bg-gray-600 bg-opacity-70 text-gray-300 font-semibold rounded-r-lg hover:bg-gray-500 transition-all duration-300"
          >
            Szukaj
          </button>
        </div>

        {error && (
          <div className="text-red-500 mt-4">
            {error}
          </div>
        )}

        {showPhotos && photos.length > 0 && (
          <div className="mt-10 w-full max-w-3xl">
            <QCPhotos photos={photos} /> {/* Przekazujemy zdjęcia jako właściwość */}
          </div>
        )}
      </div>
      <FooterSection />
      <FooterTwoSection />
    </>
  );
}
