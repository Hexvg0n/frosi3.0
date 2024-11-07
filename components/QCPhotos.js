import { useEffect, useState } from 'react';

function QCPhotos({ photos }) {
  return (
    <div>
      {photos.map((photoUrl, index) => (
        <img key={index} src={photoUrl} alt={`QC Photo ${index + 1}`} />
      ))}
    </div>
  );
}

export default QCPhotos;

