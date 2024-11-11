// /pages/qc/index.js

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import NavbarSection from "@/components/NavbarSection";
import FooterSection from "@/components/FooterSection";
import FooterTwoSection from "@/components/FooterTwoSection";
import QCPhotos from "@/components/QCPhotos";
import axios from "axios";

export default function QCPage() {
  const router = useRouter();
  const { url } = router.query;

  const [link, setLink] = useState("");
  const [groups, setGroups] = useState([]);
  const [showPhotos, setShowPhotos] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Paginacja
  const [currentPage, setCurrentPage] = useState(1);
  const groupsPerPage = 6; // Liczba grup na stronę
  const totalPages = Math.ceil(groups.length / groupsPerPage);

  useEffect(() => {
    if (url) {
      setLink(url);
      handleConvertLink(url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const handleConvertLink = async (linkToConvert) => {
    if (!linkToConvert) {
      setError("Brak wymaganego parametru URL.");
      return;
    }

    setIsLoading(true);
    setGroups([]);
    setShowPhotos(false);
    setError("");
    setCurrentPage(1); // Resetowanie do pierwszej strony

    try {
      const response = await axios.post("/api/qcPhotos", { url: linkToConvert });
      const { groups, error } = response.data;

      if (error) {
        setError(error);
        console.error("Błąd zwrócony z API:", error);
        return;
      }

      if (groups && groups.length > 0) {
        setGroups(groups);
        setShowPhotos(true);
        setError("");
      } else {
        setError("Nie udało się pobrać zdjęć dla podanego linku.");
      }
    } catch (err) {
      console.error("Błąd podczas pobierania zdjęć:", err.message);
      setError("Wystąpił błąd podczas pobierania zdjęć.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setLink(e.target.value);
  };

  const handleSearchClick = () => {
    handleConvertLink(link);
  };

  // Logika Paginacji
  const indexOfLastGroup = currentPage * groupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
  const currentGroups = groups.slice(indexOfFirstGroup, indexOfLastGroup);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <>
      <NavbarSection />
      <div className="flex flex-col items-center justify-start min-h-full pt-20 pb-20 px-4">
        {/* Formularz wyszukiwania */}
        <div className="flex items-center w-full max-w-md shadow-lg border border-gray-300 bg-gray-800 bg-opacity-60 rounded-lg p-5">
          <input
            type="text"
            placeholder="Wprowadź link do produktu"
            value={link}
            onChange={handleInputChange}
            className="flex-grow p-3 bg-gray-700 bg-opacity-70 text-gray-300 rounded-l-lg"
            disabled={url ? true : false}
          />
          <button
            onClick={handleSearchClick}
            className="p-3 bg-gray-600 bg-opacity-70 text-gray-300 font-semibold rounded-r-lg hover:bg-gray-500 transition-all duration-300"
          >
            Szukaj
          </button>
        </div>

        {/* Wyświetlanie błędów */}
        {error && <div className="text-red-500 mt-4">{error}</div>}

        {/* Spinner ładowania */}
        {isLoading && (
          <div className="mt-4">
            <p className="text-gray-300">Ładowanie zdjęć...</p>
            {/* Możesz dodać tutaj spinner */}
          </div>
        )}

        {/* Wyświetlanie grup zdjęć */}
        {showPhotos && currentGroups.length > 0 && (
          <div className="mt-10 w-full max-w-5xl">
            {/* Układ Grid: wyświetlanie grup obok siebie */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
              {currentGroups.map((group, index) => (
                <QCPhotos 
                  key={index} 
                  photos={group.photos} 
                  groupIndex={indexOfFirstGroup + index + 1} 
                />
              ))}
            </div>

            {/* Paginacja */}
            <div className="flex justify-center items-center mt-10 space-x-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 bg-gray-600 text-gray-300 rounded-lg ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-500"
                }`}
              >
                Poprzednia
              </button>
              <span className="text-gray-300">
                Strona {currentPage} z {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 bg-gray-600 text-gray-300 rounded-lg ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-500"
                }`}
              >
                Następna
              </button>
            </div>
          </div>
        )}
      </div>
      <FooterSection />
      <FooterTwoSection />
    </>
  );
}
