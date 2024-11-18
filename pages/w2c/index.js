// ./pages/w2c/index.js

import FooterSection from "@/components/FooterSection";
import FooterTwoSection from "@/components/FooterTwoSection";
import NavbarSection from "@/components/NavbarSection";
import Link from 'next/link';
import axios from "axios";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import debounce from "lodash.debounce";
import { motion } from "framer-motion";
import { Search, ShoppingCart } from "lucide-react";

export default function W2C() {
  const [items, setItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState("kakobuy");

  const queryRef = useRef(""); // Search query
  const router = useRouter();

  const categories = {
    "": "Wszystkie",
    "Hoodies/Sweaters": "Bluzy",
    Jackets: "Kurtki",
    Accessories: "Biżuteria",
    "Other Stuff": "Inne",
    "Pants/Shorts": "Spodnie",
    Headware: "Czapki",
    Shoes: "Buty",
    "T-Shirts": "Koszulki",
  };

  const agents = [
    { value: "allchinabuy", label: "AllChinaBuy" },
    { value: "superbuy", label: "SuperBuy" },
    { value: "kakobuy", label: "KakoBuy" },
    {value: "cnfans", label: "CNFans" },
    {value: "hoobuy", label: "HooBuy" },
    {value: "mulebuy", label: "MuleBuy" },


  ];

  const handleQCClick = (link) => {
    router.push(`/qc?url=${encodeURIComponent(link)}`);
  };

  const fetchItems = useCallback(async (pageToFetch) => {
    if (!hasMore && pageToFetch !== 0) return;
    setIsLoading(true);

    try {
      const response = await axios.get("/api/products", {
        params: {
          category: selectedCategory || undefined,
          name: queryRef.current || undefined,
          sortOrder: sortOrder || undefined,
          limit: 50,
          skip: pageToFetch * 50,
        },
      });

      const convertedItems = await Promise.all(
        response.data.results.map(async (item) => {
          try {
            const convertResponse = await axios.post("/api/convert", {
              url: item.link,
            });
            const convertedLink = convertResponse.data[selectedAgent];
            return {
              ...item,
              link: convertedLink || item.link,
            };
          } catch (err) {
            console.error("Error converting URL:", err);
            return item;
          }
        })
      );

      if (pageToFetch === 0 && convertedItems.length === 0) {
        setErrorMessage("Brak wyników dla podanego produktu.");
        setHasMore(false);
      } else {
        setItems((prevItems) => [...prevItems, ...convertedItems]);
        setErrorMessage("");
        setHasMore(convertedItems.length === 50);
      }
    } catch (error) {
      console.error("Error fetching items:", error.response ? error.response.data : error.message);
      setErrorMessage("Wystąpił błąd podczas pobierania danych.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, sortOrder, hasMore, selectedAgent]);

  const debouncedFetch = useCallback(
    debounce(() => {
      setItems([]);
      setPage(0);
      setHasMore(true);
      fetchItems(0);
    }, 500),
    [fetchItems]
  );

  const handleInputChange = (e) => {
    queryRef.current = e.target.value;
    setErrorMessage("");
    debouncedFetch();
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleAgentChange = (e) => {
    setSelectedAgent(e.target.value);
  };

  useEffect(() => {
    setItems([]);
    setPage(0);
    setHasMore(true);
    fetchItems(0);
  }, [selectedCategory, sortOrder, selectedAgent]);

  const observer = useRef();
  const lastItemRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    if (page === 0) return;
    fetchItems(page);
  }, [page, fetchItems]);

  return (
    <>
      <NavbarSection />
      <div className="w-full px-4 py-4  flex justify-end">
        <input
          type="text"
          placeholder="Szukaj produktów..."
          className="md:w-2/3 w-full p-3 bg-gray-800 text-gray-300 border border-gray-700 rounded-lg shadow-lg focus:ring-2 focus:ring-gray-500"
          onChange={handleInputChange}
        />
      </div>
      <div className="flex flex-col md:flex-row items-start min-h-full pt-5 pb-20 mx-4">
        <div className="w-full md:w-1/3 md:sticky mb-4 md:top-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-6 rounded-xl shadow-lg mr-4 overflow-y-auto max-h-screen">
          <div className="flex flex-col space-y-6">
            <div>
              <label htmlFor="agent" className="block text-gray-300 font-medium mb-2">
                Wybierz agenta
              </label>
              <select
                id="agent"
                value={selectedAgent}
                onChange={handleAgentChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
              >
                {agents.map((agent) => (
                  <option key={agent.value} value={agent.value}>
                    {agent.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="category" className="block text-gray-300 font-medium mb-2">
                Kategoria
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
              >
                {Object.entries(categories).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sort" className="block text-gray-300 font-medium mb-2">
                Sortuj według ceny
              </label>
              <select
                id="sort"
                value={sortOrder}
                onChange={handleSortChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
              >
                <option value="">Sortowanie (Brak)</option>
                <option value="asc">Od najtańszych</option>
                <option value="desc">Od najdroższych</option>
              </select>
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item, index) => (
            <div
              key={item._id}
              ref={items.length === index + 1 ? lastItemRef : null}
              className="bg-gray-700 bg-opacity-70 text-gray-300 font-semibold rounded-lg shadow-lg p-4 flex flex-col justify-between h-full"
            >
              <div className="flex flex-col flex-grow">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full object-cover rounded-lg mb-2 cursor-pointer"
                  onClick={() => window.open(item.link, "_blank")}
                />
                <h3 className="text-lg font-bold text-center truncate">{item.name}</h3>
                <p className="text-sm text-gray-400 text-center truncate">
                  {item.price}
                </p>
              </div>
              {item.link && (
                <div className="w-full flex flex-col space-y-2 mt-2">
                <motion.button
                      onClick={() => window.open(item.link, "_blank")}
                      className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-bold transition-colors duration-300 hover:bg-gray-200 flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ShoppingCart className="mr-2" size={20} />
                      KUP NA {selectedAgent.toUpperCase()}
                    </motion.button>

                  <motion.button
                    onClick={() => handleQCClick(item.link, )}
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
          ))}
        </div>
      </div>
      <FooterSection />
      <FooterTwoSection />
    </>
  );
}
