// ./pages/w2c/index.js

import FooterSection from "@/components/FooterSection";
import FooterTwoSection from "@/components/FooterTwoSection";
import NavbarSection from "@/components/NavbarSection";
import axios from 'axios';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import debounce from 'lodash.debounce';
import { motion } from 'framer-motion';
import { Search, ShoppingCart } from 'lucide-react';

export default function W2C() {
  const [items, setItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [bestBatchOnly, setBestBatchOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Stan dla loadera
  const [page, setPage] = useState(0); // Nowy stan do śledzenia strony

  const exchangeRate = 3.90;
  const queryRef = useRef('');

  // Definicje kategorii: klucz odpowiada wartościom w bazie danych
  const categories = {
    'Hoodies/Sweaters': "Bluzy",
    'Jackets': "Kurtki",
    'Accessories': "Biżuteria",
    'Other Stuff': "Inne",
    'Pants/Shorts': "Spodnie",
    'Headware': "Czapki",
    'Shoes': "Buty",
    'T-Shirts': 'Koszulki',
  };

  const router = useRouter(); // Inicjalizacja routera

  // Funkcja obsługująca kliknięcie przycisku "QC"
  const handleQCClick = (link) => {
    router.push(`/qc?url=${encodeURIComponent(link)}`);
  };

  // Funkcja fetchItems z sortOrder jako parametrem API
  const fetchItems = useCallback(async (pageToFetch) => {
    if (!hasMore && pageToFetch !== 0) return; // Jeśli nie ma więcej przedmiotów, nie wykonuj zapytania
    setIsLoading(true); // Start loadera
    try {
      const query = queryRef.current.trim();
      console.log('Fetching items with parameters:', {
        category: selectedCategory,
        bestbatch: bestBatchOnly,
        name: query || undefined,
        sortOrder: sortOrder || undefined,
        limit: 50,
        skip: pageToFetch * 50,
      });

      const response = await axios.get('/api/products', {
        params: {
          category: selectedCategory || undefined,
          bestbatch: bestBatchOnly,
          name: query || undefined,
          sortOrder: sortOrder || undefined,
          limit: 50, // Stała wartość limitu
          skip: pageToFetch * 50, // Obliczanie skip na podstawie aktualnej strony
        },
      });

      const resultsWithBatch = response.data.results.map(item => {
        const priceInUSD = parseFloat(item.price.replace('$', ''));
        const priceInPLN = parseFloat((priceInUSD * exchangeRate).toFixed(2)); // Przechowujemy pricePLN jako liczbę

        return {
          ...item,
          batch: item.batch || "Random",
          pricePLN: priceInPLN, // Liczba
        };
      });

      if (pageToFetch === 0 && resultsWithBatch.length === 0) {
        setErrorMessage('Brak wyników dla podanego produktu.');
        setHasMore(false);
      } else {
        setItems(prevItems => [...prevItems, ...resultsWithBatch]);
        setErrorMessage('');
        setHasMore(resultsWithBatch.length === 50); // Jeśli otrzymano mniej niż 50, to brak więcej przedmiotów
      }
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      setErrorMessage('Wystąpił błąd podczas pobierania danych.');
    } finally {
      setIsLoading(false); // Stop loadera
    }
  }, [selectedCategory, bestBatchOnly, sortOrder, hasMore, exchangeRate]);

  // Debounced fetchItems dla wyszukiwania
  const debouncedFetch = useCallback(
    debounce(() => {
      setItems([]); // Resetowanie listy przedmiotów
      setPage(0); // Resetowanie strony
      setHasMore(true); // Resetowanie flagi hasMore
      fetchItems(0);
    }, 500), // Zwiększenie opóźnienia do 500ms
    [fetchItems]
  );

  const handleInputChange = (e) => {
    queryRef.current = e.target.value;
    setErrorMessage(''); // Clear any previous error messages
    debouncedFetch();
  };

  // useEffect do pobierania danych przy zmianie zależności (filtry, sortowanie)
  useEffect(() => {
    // Resetowanie stanu tylko gdy zmieniają się filtry lub sortowanie
    setItems([]); // Resetowanie listy przedmiotów
    setPage(0); // Resetowanie strony
    setHasMore(true); // Resetowanie flagi hasMore
    fetchItems(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, bestBatchOnly, sortOrder]); // fetchItems jest już zależne od tych zmiennych

  // Referencja do elementu sentinel na końcu listy
  const observer = useRef();
  const lastItemRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  // useEffect do pobierania danych przy zmianie strony
  useEffect(() => {
    if (page === 0) return; // Strona 0 już jest pobrana w pierwszym useEffect
    fetchItems(page);
  }, [page, fetchItems]);

  return (
    <>
      <NavbarSection />
      <div className="flex flex-col md:flex-row items-start min-h-full pt-20 pb-20 mx-4">
       
        <div className="w-full md:w-1/3 md:sticky md:top-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-6 rounded-xl shadow-lg mr-4 overflow-y-auto max-h-screen">
          <div className="flex flex-col space-y-6">
           
            {/* Możesz odkomentować i dostosować filtrowanie BESTBATCH jeśli jest potrzebne */}
            {/* <div className="flex items-center">
              <input
                type="checkbox"
                id="bestBatchOnly"
                checked={bestBatchOnly}
                onChange={() => setBestBatchOnly(prev => !prev)}
                className="mr-3 w-4 h-4 text-gray-500 bg-gray-700 border-gray-600 focus:ring-gray-600 rounded"
              />
              <label htmlFor="bestBatchOnly" className="text-gray-300 font-medium">BESTBATCH</label>
            </div> */}

            <div>
              <label htmlFor="category" className="block text-gray-300 font-medium mb-2">Kategoria</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
              >
                <option value="">Wybierz kategorię (Brak)</option>
                {Object.entries(categories).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option> 
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sort" className="block text-gray-300 font-medium mb-2">Sortuj według ceny</label>
              <select
                id="sort"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
              >
                <option value="">Sortuj według ceny (Brak)</option>
                <option value="asc">Od najtańszych</option>
                <option value="desc">Od najdroższych</option>
              </select>
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/3 flex flex-col items-center justify-start space-y-4 p-4">
          <div className="flex items-center w-full max-w-6xl space-x-4 mb-4">
            <div className="flex-grow">
              <div className="flex items-center shadow-lg border border-gray-300 bg-gray-800 bg-opacity-60 rounded-lg">
                <input
                  type="text"
                  placeholder="Wprowadź nazwę produktu"
                  className="flex-grow p-3 bg-gray-700 bg-opacity-70 text-gray-300 rounded-l-lg"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {items.length === 0 && isLoading && (
            <div className="w-full max-w-6xl mt-4 p-4 bg-gray-800 text-gray-300 text-center font-semibold rounded-lg shadow-lg">
              Ładowanie przedmiotów...
            </div>
          )}

          {errorMessage && (
            <div className="w-full max-w-6xl mt-4 p-4 bg-red-700 border-2 border-red-900 text-white font-semibold rounded-lg shadow-lg">
              {errorMessage}
            </div>
          )}

          <div className="w-full max-w-6xl mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
            {items.map((item, index) => {
              if (items.length === index + 1) {
                // Ostatni element - przypisanie ref do obserwatora
                return (
                  <div
                    key={item._id}
                    ref={lastItemRef}
                    className="bg-gray-700 bg-opacity-70 text-gray-300 font-semibold rounded-lg shadow-lg p-4 flex flex-col justify-between h-full"
                  >
                    <div className="flex flex-col flex-grow">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full object-cover rounded-lg mb-2 flex-shrink-0 cursor-pointer"
                        onClick={() => window.open(item.link, '_blank')}
                      />
                      <h3 className="text-lg font-bold text-center truncate">{item.name}</h3>
                      <p className="text-sm text-gray-400 text-center truncate">{item.price} ({item.pricePLN.toFixed(2)} PLN)</p>
                    </div>
                    {item.link && (
                      <div className="w-full flex flex-col space-y-2 mt-2">
                        <motion.button
                          onClick={() => window.open(item.link, '_blank')}
                          className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-bold transition-colors duration-300 hover:bg-gray-200 flex items-center justify-center"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ShoppingCart className="mr-2" size={20} />
                          Kup na AllChinaBuy
                        </motion.button>
                        
                        <motion.button
                          onClick={() => handleQCClick(item.link)}
                          className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-gray-400 font-bold flex items-center justify-center"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Search className="mr-2" size={20} />
                          QC
                        </motion.button>
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div
                    key={item._id}
                    className="bg-gray-700 bg-opacity-70 text-gray-300 font-semibold rounded-lg shadow-lg p-4 flex flex-col justify-between h-full"
                  >
                    <div className="flex flex-col flex-grow">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full object-cover rounded-lg mb-2 flex-shrink-0 cursor-pointer"
                        onClick={() => window.open(item.link, '_blank')}
                      />
                      <h3 className="text-lg font-bold text-center truncate">{item.name}</h3>
                      <p className="text-sm text-gray-400 text-center truncate">{item.price} ({item.pricePLN.toFixed(2)} PLN)</p>
                    </div>
                    {item.link && (
                      <div className="w-full flex flex-col space-y-2 mt-2">
                        <motion.button
                          onClick={() => window.open(item.link, '_blank')}
                          className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-bold transition-colors duration-300 hover:bg-gray-200 flex items-center justify-center"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ShoppingCart className="mr-2" size={20} />
                          Kup na AllChinaBuy
                        </motion.button>
                        
                        <motion.button
                          onClick={() => handleQCClick(item.link)}
                          className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-gray-400 font-bold flex items-center justify-center"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Search className="mr-2" size={20} />
                          QC
                        </motion.button>
                      </div>
                    )}
                  </div>
                );
              }
            })}
          </div>

          {isLoading && page > 0 && (
            <div className="w-full max-w-6xl mt-4 p-4 bg-gray-800 text-gray-300 text-center font-semibold rounded-lg shadow-lg">
              Ładowanie przedmiotów...
            </div>
          )}

          {!hasMore && items.length > 0 && (
            <div className="w-full max-w-6xl mt-4 p-4 bg-gray-800 text-gray-300 text-center font-semibold rounded-lg">
              Brak więcej przedmiotów do załadowania.
            </div>
          )}
        </div>
      </div>
      <FooterSection />
      <FooterTwoSection />
    </>
  );
}
