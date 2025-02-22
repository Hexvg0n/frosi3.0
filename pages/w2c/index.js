// pages/w2c/index.js
import React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Eye, Filter, X, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import NavbarSection from "@/components/NavbarSection";
import FooterSection from "@/components/FooterSection";
import FooterTwoSection from "@/components/FooterTwoSection";

const GradientBackground = () => (
  <div className="fixed inset-0 z-0 opacity-30">
    <div 
      className="absolute w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,#4F46E5_0%,transparent_60%)]"
      style={{
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        animation: 'gradient-pulse 15s infinite alternate'
      }}
    />
    <style jsx global>{`
      @keyframes gradient-pulse {
        0% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
        50% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.2); }
        100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
      }
    `}</style>
  </div>
);

const GlassCard = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-black/30"
  >
    {children}
  </motion.div>
);

const PriceBadge = ({ price, trend }) => {
  const TrendIcon = trend === 'up' ? ArrowUp : ArrowDown;
  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600/40 to-blue-600/40 px-3 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-sm border border-white/10">
      <span className="font-bold text-sm sm:text-base bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
        {price}
      </span>
      <TrendIcon className={`w-4 h-4 ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`} />
    </div>
  );
};

const ProductCard = React.memo(({ item }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative group bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-lg border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl shadow-black/30 hover:border-purple-500/30 transition-all duration-300 min-h-[420px] sm:min-h-[500px] flex flex-col"
    >
      <div className="relative aspect-square mb-4 sm:mb-6 overflow-hidden rounded-xl">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20"
          animate={{ opacity: isHovered ? 1 : 0 }}
        />
        <motion.img
          src={item.productImage}
          alt={item.name}
          className="w-full h-full object-cover"
          initial={{ scale: 1 }}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
      </div>

      <div className="space-y-2 sm:space-y-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-100 line-clamp-2 text-sm sm:text-lg">
          {item.name}
        </h3>
        
        <div className="flex items-center justify-between mt-auto">
          <PriceBadge price={item.price} trend={item.trend} />
          <span className="text-xs text-gray-400 font-mono">{item.category}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-2 sm:mt-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm bg-purple-600/30 hover:bg-purple-500/50 rounded-lg sm:rounded-xl backdrop-blur-sm border border-white/10"
            onClick={() => window.open(item.link, '_blank')}
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
            <span className="bg-gradient-to-r from-purple-200 to-purple-300 bg-clip-text text-transparent font-medium">
              Kup teraz
            </span>
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm bg-blue-600/30 hover:bg-blue-500/50 rounded-lg sm:rounded-xl backdrop-blur-sm border border-white/10"
            onClick={() => router.push(`/qc?url=${encodeURIComponent(item.link)}`)}
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
            <span className="bg-gradient-to-r from-blue-200 to-blue-300 bg-clip-text text-transparent font-medium">
              Zobacz QC
            </span>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
});

const W2C = () => {
  const router = useRouter();
  const PAGE_SIZE = 50;
  
  const [state, setState] = useState({
    items: [],
    filters: {
      category: '',
      sort: '',
      agent: 'kakobuy',
      search: ''
    },
    isLoading: false,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  const filtersRef = useRef(state.filters);

  useEffect(() => {
    filtersRef.current = state.filters;
  }, [state.filters]);

  const fetchItems = useCallback(async (page = 1) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { data } = await axios.get('/api/products', {
        params: {
          ...filtersRef.current,
          limit: PAGE_SIZE,
          skip: (page - 1) * PAGE_SIZE
        }
      });

      const currentAgent = filtersRef.current.agent;
      
      const enhancedItems = await Promise.all(data.results.map(async item => {
        try {
          const { data } = await axios.post('/api/convert', { url: item.link });
          return {
            ...item,
            link: data[currentAgent] || item.link,
            productImage: data.product?.productImage || item.image_url,
          };
        } catch {
          return { 
            ...item, 
            productImage: item.image_url
          };
        }
      }));

      setState(prev => ({
        ...prev,
        items: enhancedItems,
        totalPages: Math.ceil(data.totalCount / PAGE_SIZE),
        totalItems: data.totalCount,
        currentPage: page,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const handleSearch = useCallback(debounce(() => {
    fetchItems(1);
  }, 500), []);

  const handleFilterChange = (name, value) => {
    const scrollY = window.scrollY;
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, [name]: value },
      currentPage: 1
    }));
    
    setTimeout(() => fetchItems(1).then(() => window.scrollTo(0, scrollY)), 0);
  };

  useEffect(() => {
    fetchItems(state.currentPage);
  }, [state.currentPage]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 relative overflow-hidden">
      <div className="h-[10vh]"/>
      <GradientBackground />
      <NavbarSection className="z-40" />

      <main className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 sm:mb-16"
        >
          <div className="relative mx-2 sm:mx-auto max-w-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-2xl rounded-3xl" />
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="🔍 Wpisz nazwę produktu..."
                className="w-full pl-4 pr-4 py-3 sm:pl-6 sm:pr-6 sm:py-5 text-sm sm:text-base bg-gray-900/50 backdrop-blur-lg border-2 border-white/10 rounded-xl sm:rounded-2xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all font-medium"
                value={state.filters.search}
                onChange={(e) => {
                  handleFilterChange('search', e.target.value);
                  handleSearch();
                }}
              />
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
          <aside className="lg:w-80 space-y-4 sticky top-24 h-fit px-2 sm:px-0">
            <GlassCard>
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                Filtry & Sortowanie
              </h2>
              <Filters 
                filters={state.filters}
                onChange={handleFilterChange}
              />
            </GlassCard>
          </aside>

          <div className="flex-1">
            {state.isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="min-h-[420px] sm:min-h-[500px] bg-gray-900/50 rounded-2xl sm:rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {state.items.map((item) => (
                    <ProductCard key={item._id} item={item} />
                  ))}
                </div>

                {state.totalItems > 0 && (
                  <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-2 sm:px-0">
                    <span className="text-gray-400 text-sm">
                      Pokazano {(state.currentPage - 1) * PAGE_SIZE + 1}-
                      {Math.min(state.currentPage * PAGE_SIZE, state.totalItems)} z {state.totalItems}
                    </span>
                    
                    <div className="flex gap-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 sm:px-4 py-2 text-sm rounded-lg ${
                          state.currentPage === 1 
                            ? 'bg-gray-800/50 cursor-not-allowed' 
                            : 'bg-purple-600/30 hover:bg-purple-500/50'
                        }`}
                        onClick={() => fetchItems(state.currentPage - 1)}
                        disabled={state.currentPage === 1}
                      >
                        Poprzednia
                      </motion.button>
                      
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 sm:px-4 py-2 text-sm rounded-lg ${
                          state.currentPage >= state.totalPages 
                            ? 'bg-gray-800/50 cursor-not-allowed' 
                            : 'bg-purple-600/30 hover:bg-purple-500/50'
                        }`}
                        onClick={() => fetchItems(state.currentPage + 1)}
                        disabled={state.currentPage >= state.totalPages}
                      >
                        Następna
                      </motion.button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <FooterSection />
      <FooterTwoSection />
    </div>
  );
};

const Filters = ({ filters, onChange }) => {
  const sortOptions = [
    { value: '', label: 'Domyślne', color: 'from-gray-300 to-gray-500' },
    { value: 'price_asc', label: 'Cena ↑', color: 'from-green-300 to-green-500' },
    { value: 'price_desc', label: 'Cena ↓', color: 'from-red-300 to-red-500' },
  ];

  const agents = [
    'kakobuy',
    'superbuy',
    'cnfans',
    'allchinabuy',
    'hoobuy',
    'mulebuy',
    'lovegobuy',
    'joyabuy',
    'basetao'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs sm:text-sm font-semibold mb-3 text-gray-400">Agent Zakupowy</h3>
        <div className="relative">
          <select
            value={filters.agent}
            onChange={(e) => onChange('agent', e.target.value)}
            className="w-full p-2 sm:p-3 text-sm bg-gray-900/30 backdrop-blur-sm border border-white/10 rounded-lg sm:rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          >
            {agents.map((agent) => (
              <option 
                key={agent} 
                value={agent}
                className="bg-gray-800 text-gray-100 text-sm"
              >
                {agent.charAt(0).toUpperCase() + agent.slice(1)}
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs sm:text-sm font-semibold mb-3 text-gray-400">Kategorie</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries({
            '': 'Wszystkie',
            'Shoes': 'Buty',
            'Hoodies/Sweaters': 'Bluzy',
            'T-Shirts': 'Koszulki',
            'Jackets': 'Kurtki',
            'Pants/Shorts': 'Spodnie/Shortsy',
            'Accessories': 'Akcesoria',
            'Hats': 'Czapki',
            'Others': 'Inne'
          }).map(([value, label]) => (
            <motion.button
              key={value}
              onClick={() => onChange('category', value)}
              className={`p-2 text-xs sm:text-sm rounded-md ${
                filters.category === value 
                  ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30'
                  : 'bg-gray-900/30 hover:bg-gray-800/30'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <span className={filters.category === value ? 'text-purple-300' : 'text-gray-400'}>
                {label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs sm:text-sm font-semibold mb-3 text-gray-400">Sortuj według</h3>
        <div className="flex flex-col gap-2">
          {sortOptions.map((option) => (
            <motion.button
              key={option.value}
              onClick={() => onChange('sort', option.value)}
              className={`flex items-center gap-2 p-2 sm:p-3 rounded-lg ${
                filters.sort === option.value
                  ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30'
                  : 'bg-gray-900/30 hover:bg-gray-800/30'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <div className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r ${option.color}`} />
              <span className={`text-xs sm:text-sm ${filters.sort === option.value ? 'text-white' : 'text-gray-400'}`}>
                {option.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default W2C;