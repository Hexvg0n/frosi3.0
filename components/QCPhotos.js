// ./components/QCPhotos.js

import { useState } from 'react';

function QCPhotos({ photos, groupIndex }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0); // Indeks aktualnie wyświetlanego zdjęcia

  const openLightbox = (photoUrl) => {
    setSelectedPhoto(photoUrl);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const handleImageLoad = (index) => {
    setLoadingStates((prevStates) => ({
      ...prevStates,
      [index]: false,
    }));
  };

  const handleImageError = (index) => {
    setLoadingStates((prevStates) => ({
      ...prevStates,
      [index]: false,
    }));
  };

  const showPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  const showNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };

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
              }`}
              loading="lazy"
              onLoad={() => handleImageLoad(currentIndex)}
              onError={() => handleImageError(currentIndex)}
              onClick={() => openLightbox(photos[currentIndex])}
            />
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
          <img
            src={selectedPhoto}
            alt="Selected QC Photo"
            className="max-w-full max-h-full rounded-lg"
          />
        </div>
      )}
    </div>
  );
}

export default QCPhotos;
