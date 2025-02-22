import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

function QCPhotos({ photos, groupIndex }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxLoading, setLightboxLoading] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const openLightbox = (photoUrl, index) => {
    setSelectedPhoto(photoUrl);
    setCurrentIndex(index);
    setLightboxLoading(true);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    setLightboxLoading(false);
  };

  const handleImageLoad = (index) => {
    setLoadingStates(prev => ({ ...prev, [index]: false }));
    if (index === currentIndex) setLightboxLoading(false);
  };

  const handleImageError = (index) => {
    setLoadingStates(prev => ({ ...prev, [index]: false }));
    if (index === currentIndex) setLightboxLoading(false);
  };

  const showPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? photos.length - 1 : prev - 1));
    setLightboxLoading(true);
  }, [photos.length]);

  const showNext = useCallback(() => {
    setCurrentIndex(prev => (prev === photos.length - 1 ? 0 : prev + 1));
    setLightboxLoading(true);
  }, [photos.length]);

  const handleKeyDown = useCallback((e) => {
    if (!selectedPhoto) return;
    if (e.key === 'ArrowLeft') showPrevious();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'Escape') closeLightbox();
  }, [selectedPhoto, showPrevious, showNext]);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) < minSwipeDistance) return;
    distance > 0 ? showNext() : showPrevious();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (photos.length > 0 && currentIndex >= photos.length) {
      setCurrentIndex(0);
      closeLightbox();
    }
  }, [photos, currentIndex]);

  useEffect(() => {
    if (photos.length > 0 && currentIndex !== 0) {
      setCurrentIndex(0);
      setLoadingStates({});
    }
  }, [photos]);

  if (photos.length === 0) {
    return <div className="text-gray-300 p-4">Brak dostępnych zdjęć w tej grupie.</div>;
  }

  return (
    <div className="relative bg-gray-700/75 p-4 rounded-xl shadow-lg">
      <div className="flex items-center justify-center w-full relative">
        {/* Navigation Arrows */}
        <button
          onClick={showPrevious}
          className="absolute left-0 z-10 p-2 bg-gray-800/50 backdrop-blur-sm rounded-full hover:bg-purple-500/30 transition-all duration-300 group -translate-x-1/2"
          aria-label={`Poprzednie zdjęcie w grupie ${groupIndex}`}
        >
          <ArrowLeft className="w-6 h-6 text-purple-300 group-hover:text-purple-400 group-hover:scale-110 transition-transform" />
        </button>

        {/* Main Image Container */}
        <div className="relative w-full max-w-2xl">
          {loadingStates[currentIndex] && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded-xl">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
          )}

          <motion.img
            src={photos[currentIndex]}
            alt={`QC Photo ${currentIndex + 1} w grupie ${groupIndex}`}
            className={`w-full h-64 object-contain rounded-lg shadow-lg cursor-zoom-in ${
              loadingStates[currentIndex] ? 'opacity-0' : 'opacity-100'
            }`}
            loading="lazy"
            onLoad={() => handleImageLoad(currentIndex)}
            onError={() => handleImageError(currentIndex)}
            onClick={() => openLightbox(photos[currentIndex], currentIndex)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />

          <div className="absolute bottom-2 right-2 bg-gray-800/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-purple-300">
            {currentIndex + 1}/{photos.length}
          </div>
        </div>

        <button
          onClick={showNext}
          className="absolute right-0 z-10 p-2 bg-gray-800/50 backdrop-blur-sm rounded-full hover:bg-purple-500/30 transition-all duration-300 group translate-x-1/2"
          aria-label={`Następne zdjęcie w grupie ${groupIndex}`}
        >
          <ArrowRight className="w-6 h-6 text-purple-300 group-hover:text-purple-400 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Lightbox Overlay */}
      {selectedPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex md:items-center justify-center"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            {/* Lightbox Loading */}
            {lightboxLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
              </div>
            )}

            {/* Lightbox Content */}
            <motion.img
              src={photos[currentIndex]}
              alt={`QC Photo ${currentIndex + 1} w grupie ${groupIndex}`}
              className="w-full h-full object-contain"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onLoad={() => handleImageLoad(currentIndex)}
            />

            {/* Lightbox Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-800/70 backdrop-blur-sm px-4 py-2 rounded-full text-purple-300">
              {currentIndex + 1}/{photos.length}
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); showPrevious(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-gray-800/70 backdrop-blur-sm rounded-full hover:bg-purple-500/30 transition-all duration-300 group"
            >
              <ArrowLeft className="w-8 h-8 text-purple-300 group-hover:text-purple-400 group-hover:scale-110" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); showNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-gray-800/70 backdrop-blur-sm rounded-full hover:bg-purple-500/30 transition-all duration-300 group"
            >
              <ArrowRight className="w-8 h-8 text-purple-300 group-hover:text-purple-400 group-hover:scale-110" />
            </button>

            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 bg-gray-800/70 backdrop-blur-sm rounded-full hover:bg-purple-500/30 transition-all duration-300 group"
            >
              <X className="w-8 h-8 text-purple-300 group-hover:text-purple-400 group-hover:rotate-90" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default QCPhotos;