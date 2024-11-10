// ./components/QCPhotos.js

import { useState } from 'react';

function QCPhotos({ photos }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loadingStates, setLoadingStates] = useState({}); // Stan ładowania dla każdego zdjęcia

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

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {photos.map((photoUrl, index) => (
          <div
            key={index}
            className="relative cursor-pointer"
            onClick={() => openLightbox(photoUrl)}
          >
            {loadingStates[index] !== false && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
                {/* Spinner ładowania */}
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
            <img
              src={photoUrl}
              alt={`QC Photo ${index + 1}`}
              className={`w-full h-auto object-cover rounded-lg shadow-md hover:opacity-80 transition-opacity ${
                loadingStates[index] === false ? '' : 'invisible'
              }`}
              loading="lazy"
              onLoad={() => handleImageLoad(index)}
              onError={() => handleImageError(index)}
            />
          </div>
        ))}
      </div>

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
