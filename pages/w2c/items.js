import { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarSection from '@/components/NavbarSection';
import FooterSection from '@/components/FooterSection';
import FooterTwoSection from '@/components/FooterTwoSection';

export default function W2CItemsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', sort: '', search: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/products', { params: filters });
        setProducts(response.data.results);
      } catch (error) {
        console.error("Błąd podczas pobierania produktów:", error);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <NavbarSection />
      <main className="max-w-7xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center mb-8">Przedmioty W2C</h1>
        <div className="flex justify-between mb-4">
          <input type="text" name="search" placeholder="Szukaj..." onChange={handleFilterChange} className="p-2 bg-gray-800 rounded" />
          <select name="category" onChange={handleFilterChange} className="p-2 bg-gray-800 rounded">
            <option value="">Wszystkie kategorie</option>
            {/* Tutaj można dynamicznie ładować kategorie */}
          </select>
          <select name="sort" onChange={handleFilterChange} className="p-2 bg-gray-800 rounded">
            <option value="">Sortuj domyślnie</option>
            <option value="price_asc">Cena rosnąco</option>
            <option value="price_desc">Cena malejąco</option>
          </select>
        </div>
        {loading ? (
          <p className="text-center">Ładowanie...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-gray-800 rounded-lg p-4">
                <img src={product.image_url} alt={product.name} className="w-full h-64 object-cover mb-4 rounded" />
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p>Kategoria: {product.category}</p>
                <p>Cena: {product.price} CNY ({product.pricePLN} PLN)</p>
                <p>Batch: {product.batch}</p>
                <a href={product.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Link</a>
              </div>
            ))}
          </div>
        )}
      </main>
      <FooterSection />
      <FooterTwoSection />
    </div>
  );
}