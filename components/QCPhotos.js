// ./components/QCPhotos.js

import { useState } from 'react';
import Image from 'next/image';

function QCPhotos({ photos }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const openLightbox = (photoUrl) => {
    setSelectedPhoto(photoUrl);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {photos.map((photoUrl, index) => (
          <div key={index} className="cursor-pointer" onClick={() => openLightbox(photoUrl)}>
            <img
              src={photoUrl}
              alt={`QC Photo ${index + 1}`}
              className="w-full h-auto object-cover rounded-lg shadow-md hover:opacity-80 transition-opacity"
            />
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeLightbox}>
          <img src={selectedPhoto} alt="Selected QC Photo" className="max-w-full max-h-full rounded-lg" />
        </div>
      )}
    </div>
  );
}

export default QCPhotos;
