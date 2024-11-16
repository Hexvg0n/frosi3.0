// ./components/QCPhotos.js

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

function QCPhotos({ photos, groupIndex }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0); // Indeks aktualnie wyświetlanego zdjęcia
  const [lightboxLoading, setLightboxLoading] = useState(false); // Stan ładowania lightboxa

  // Funkcje do obsługi lightboxu
  const openLightbox = (photoUrl, index) => {
    setSelectedPhoto(photoUrl);
    setCurrentIndex(index);
    setLightboxLoading(true); // Rozpoczęcie ładowania lightboxa
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    setLightboxLoading(false); // Resetowanie stanu ładowania
  };

  const handleImageLoad = (index) => {
    setLoadingStates((prevStates) => ({
      ...prevStates,
      [index]: false,
    }));
    if (index === currentIndex) {
      setLightboxLoading(false); // Zakończenie ładowania lightboxa
    }
  };

  const handleImageError = (index) => {
    setLoadingStates((prevStates) => ({
      ...prevStates,
      [index]: false,
    }));
    if (index === currentIndex) {
      setLightboxLoading(false); // Zakończenie ładowania lightboxa w przypadku błędu
    }
  };

  const showPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
    setLightboxLoading(true); // Rozpoczęcie ładowania nowego zdjęcia
  };

  const showNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
    setLightboxLoading(true); // Rozpoczęcie ładowania nowego zdjęcia
  };

  // Obsługa nawigacji za pomocą klawiatury
  const handleKeyDown = useCallback(
    (e) => {
      if (!selectedPhoto) return;

      if (e.key === 'ArrowLeft') {
        showPrevious();
      } else if (e.key === 'ArrowRight') {
        showNext();
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    },
    [selectedPhoto]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Obsługa gestów swipe na urządzeniach mobilnych
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50; // Minimalna odległość swipe w pikselach

  const onTouchStart = (e) => {
    setTouchEnd(null); // Reset touchEnd
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      showNext();
    } else if (isRightSwipe) {
      showPrevious();
    }
  };

  useEffect(() => {
    if (selectedPhoto) {
      setTouchStart(null);
      setTouchEnd(null);
    }
  }, [selectedPhoto]);

  if (photos.length === 0) {
    return <div className="text-gray-300">Brak dostępnych zdjęć w tej grupie.</div>;
  }

  return (
    <div className="relative bg-gray-700 bg-opacity-75 p-4 rounded-lg shadow-lg flex flex-col items-center justify-center">
      <div className="flex items-center justify-center w-full">
        {/* Przyciski Nawigacyjne */}
        <button
          onClick={showPrevious}
          className="absolute left-0 z-10 p-2 bg-gray-800 bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-opacity duration-300"
          aria-label={`Poprzednie zdjęcie w grupie ${groupIndex}`}
        >
          &#8592;
        </button>

        <div className="flex items-center justify-center">
          <div className="relative">
            {/* Spinner ładowania */}
            {loadingStates[currentIndex] !== false && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
                <svg
                  className="animate-spin h-8 w-8 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              </div>
            )}
            {/* Wyświetlanie Aktualnego Zdjęcia */}
            <img
              src={photos[currentIndex]}
              alt={`QC Photo ${currentIndex + 1} w grupie ${groupIndex}`}
              className={`max-h-full object-contain rounded-lg shadow-md hover:opacity-80 transition-opacity ${
                loadingStates[currentIndex] === false ? '' : 'invisible'
              } cursor-pointer`}
              loading="lazy"
              onLoad={() => handleImageLoad(currentIndex)}
              onError={() => handleImageError(currentIndex)}
              onClick={() => openLightbox(photos[currentIndex], currentIndex)}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            />
            {/* Licznik Zdjęć */}
            <div
              className="absolute bottom-2 right-2 bg-gray-800 bg-opacity-50 text-white text-sm px-2 py-1 rounded"
              aria-label={`Zdjęcie ${currentIndex + 1} z ${photos.length}`}
            >
              {currentIndex + 1}/{photos.length}
            </div>
          </div>
        </div>

        <button
          onClick={showNext}
          className="absolute right-0 z-10 p-2 bg-gray-800 bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-opacity duration-300"
          aria-label={`Następne zdjęcie w grupie ${groupIndex}`}
        >
          &#8594;
        </button>
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-3xl max-h-full"
            onClick={(e) => e.stopPropagation()} // Zapobiega zamknięciu lightboxu po kliknięciu na zdjęcie
          >
            {/* Spinner ładowania w Lightboxie */}
            {lightboxLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <svg
                  className="animate-spin h-12 w-12 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              </div>
            )}
            {/* Wyświetlanie Aktualnego Zdjęcia w Lightboxie */}
            <motion.img
              src={photos[currentIndex]}
              alt={`QC Photo ${currentIndex + 1} w grupie ${groupIndex}`}
              className={`max-w-full max-h-full rounded-lg shadow-md ${
                lightboxLoading ? 'invisible' : 'visible'
              }`}
              loading="lazy"
              onLoad={() => handleImageLoad(currentIndex)}
              onError={() => handleImageError(currentIndex)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            {/* Licznik Zdjęć w Lightbox */}
            <div
              className="absolute bottom-4 right-4 bg-gray-800 bg-opacity-50 text-white text-sm px-2 py-1 rounded"
              aria-label={`Zdjęcie ${currentIndex + 1} z ${photos.length}`}
            >
              {currentIndex + 1}/{photos.length}
            </div>
            {/* Przyciski Nawigacyjne w Lightboxie */}
            <button
              onClick={showPrevious}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 p-3 bg-gray-800 bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-opacity duration-300"
              aria-label={`Poprzednie zdjęcie w grupie ${groupIndex}`}
            >
              &#8592;
            </button>
            <button
              onClick={showNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 p-3 bg-gray-800 bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-opacity duration-300"
              aria-label={`Następne zdjęcie w grupie ${groupIndex}`}
            >
              &#8594;
            </button>
            {/* Przycisk Zamknięcia */}
            <button
              onClick={closeLightbox}
              className="absolute top-0 right-0 m-4 p-2 bg-gray-800 bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-opacity duration-300"
              aria-label="Zamknij lightbox"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QCPhotos;
