// /pages/finder/index.js
import FooterSection from "@/components/FooterSection";
import FooterTwoSection from "@/components/FooterTwoSection";
import NavbarSection from "@/components/NavbarSection";
import axios from 'axios';
import { useState } from 'react';
import { generateSignature } from "@/signature";

export default function Finder() {
  const [items, setItems] = useState([]);
  const [isCooldown, setIsCooldown] = useState(false);
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState(null); // Track which image is currently in fullscreen
  const [fullScreenImages, setFullScreenImages] = useState([]); // Store images for full-screen view
  const [errorMessage, setErrorMessage] = useState(''); // Track error messages

  const exchangeRate = 3.90; // Exchange rate from USD to PLN

  // Funkcja do konwersji linków na AllChinaBuy
  const convertToAllChinaBuy = async (url) => {
    try {
      const response = await axios.post('/api/convert', { url });
      return response.data.allchinabuy || null; // Zakładam, że API zwraca klucz 'allchinabuy'
    } catch (error) {
      console.error('Błąd podczas konwersji linku:', error);
      return null;
    }
  };

  const handleFind = async () => {
    if (isCooldown) return;

    const query = document.querySelector('input').value.trim();

    if (!query) {
      setErrorMessage('Proszę wprowadzić nazwę produktu.');
      return;
    }

    try {
      const response = await axios.post(
        'https://api.skaut.lol/find',
        { name: query },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer b9d79a8b4d8c8d88c4e4f9a8e5b3c9d4c6e7f8a9b0d1e2f3g4h5i6j7k8l9m0n1',
            'x-signature': generateSignature({ name: query }, process.env.SECRET_KEY),
          },
        }
      );

      const resultsWithBatch = response.data.results.map(item => {
        const priceInUSD = parseFloat(item.price.replace('$', ''));
        const priceInPLN = (priceInUSD * exchangeRate).toFixed(2);

        return {
          ...item,
          batch: item.batch || "Random",
          pricePLN: priceInPLN,
        };
      });

      if (resultsWithBatch.length === 0) {
        setErrorMessage('Brak wyników dla podanego produktu.');
        setItems([]);
      } else {
        // Konwersja linków na AllChinaBuy
        const convertedItems = await Promise.all(resultsWithBatch.map(async (item) => {
          if (item.links && item.links[0]) {
            const allChinaBuyLink = await convertToAllChinaBuy(item.links[0]);
            return {
              ...item,
              allchinaLink: allChinaBuyLink, // Dodanie nowego klucza z linkiem AllChinaBuy
            };
          }
          return item;
        }));

        setItems(convertedItems);
        setErrorMessage('');
      }

      setIsCooldown(true);
      setTimeout(() => {
        setIsCooldown(false);
      }, 5000);

    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      setErrorMessage('Wystąpił błąd podczas pobierania danych.');
    }
  };

  const openFullScreen = (images, index) => {
    setFullScreenImages(images);
    setFullScreenImageIndex(index);
  };

  const closeFullScreen = () => {
    setFullScreenImages([]);
    setFullScreenImageIndex(null);
  };

  const navigateFullScreen = (direction) => {
    if (fullScreenImages.length === 0 || fullScreenImageIndex === null) return;

    setFullScreenImageIndex(prevIndex => {
      const newIndex = (prevIndex + direction + fullScreenImages.length) % fullScreenImages.length;
      return newIndex;
    });
  };

  return (
    <>
      <NavbarSection />
      <div className="flex flex-col items-center justify-start min-h-full pt-20 pb-20">
        <div className="flex items-center w-full max-w-md shadow-lg border border-gray-300 bg-gray-800 bg-opacity-60 rounded-lg">
          <input
            type="text"
            placeholder="Wprowadź nazwę produktu"
            className="flex-grow p-3 bg-gray-700 bg-opacity-70 text-gray-300 rounded-l-lg"
          />
          <button
            onClick={handleFind}
            className={`p-3 ${isCooldown ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-600'} bg-opacity-70 text-gray-300 font-semibold rounded-r-lg hover:bg-gray-500 transition-all duration-300`}
            disabled={isCooldown}
          >
            Znajdź
          </button>
        </div>
        {errorMessage && (
          <div className="mt-4 p-4 bg-red-700 border-2 border-red-900 text-white font-semibold rounded-lg shadow-lg">
            {errorMessage}
          </div>
        )}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center max-w-6xl mx-auto">
          {items.length > 0 && items.map(item => (
            <div
              key={item._id}
              className="bg-gray-700 bg-opacity-70 text-gray-300 font-semibold rounded-lg shadow-lg p-4 flex flex-col items-center gap-2 hover:bg-gray-600 transition-all duration-300"
            >
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-full h-32 object-cover mb-2 rounded-lg cursor-pointer"
                onClick={() => openFullScreen(item.images, 0)}
              />
              <h3 className="text-lg font-bold text-center">{item.name}</h3>
              <p className="text-sm text-gray-400 text-center">{item.price} ({item.pricePLN} PLN)</p>
              <p className="text-sm text-gray-500 text-center">Batch: {item.batch}</p>
              {item.allchinaLink ? (
                <button
                  onClick={() => window.open(item.allchinaLink, '_blank')}
                  className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all font-bold mt-2"
                >
                  Kup na AllChinaBuy
                </button>
              ) : (
                <button
                  onClick={() => window.open(item.links[0], '_blank')}
                  className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all font-bold mt-2"
                >
                  Kup na AllChinaBuy
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {fullScreenImageIndex !== null && fullScreenImages.length > 0 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={closeFullScreen}
        >
          <button 
            className="absolute left-4 p-4 text-white bg-gray-800 bg-opacity-70 rounded-full hover:bg-gray-700 transition-transform transform hover:scale-110"
            onClick={(e) => { e.stopPropagation(); navigateFullScreen(-1); }}
          >
            &lt;
          </button>
          <img 
            src={fullScreenImages[fullScreenImageIndex]} 
            alt="Full Screen" 
            className="max-w-full max-h-full cursor-pointer" 
            onClick={(e) => e.stopPropagation()} 
          />
          <button 
            className="absolute right-4 p-4 text-white bg-gray-800 bg-opacity-70 rounded-full hover:bg-gray-700 transition-transform transform hover:scale-110"
            onClick={(e) => { e.stopPropagation(); navigateFullScreen(1); }}
          >
            &gt;
          </button>
          <button 
            className="absolute top-4 right-4 p-4 text-white bg-gray-800 bg-opacity-70 rounded-full hover:bg-gray-700"
            onClick={closeFullScreen}
          >
            &times;
          </button>
        </div>
      )}

      <FooterSection />
      <FooterTwoSection />
    </>
  );
}
