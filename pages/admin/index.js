import { useState } from 'react';
import axios from 'axios';
import NavbarSection from '@/components/NavbarSection';
import FooterSection from '@/components/FooterSection';
import FooterTwoSection from '@/components/FooterTwoSection';

export default function AdminPage() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    batch: '',
    pricePLN: '',
    image_url: '',
    link: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/addProduct', formData);
      setMessage(response.data.message);
      // Wyczyszczenie formularza po pomyślnym dodaniu
      setFormData({
        name: '',
        category: '',
        price: '',
        batch: '',
        pricePLN: '',
        image_url: '',
        link: '',
        password: ''
      });
    } catch (error) {
      setMessage(error.response.data.error || 'Wystąpił błąd');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <NavbarSection />
      <main className="max-w-2xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center mb-8">Admin Panel - Dodaj produkt</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Nazwa produktu" value={formData.name} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded" />
          <input type="text" name="category" placeholder="Kategoria" value={formData.category} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded" />
          <input type="text" name="price" placeholder="Cena (CNY)" value={formData.price} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded" />
          <input type="text" name="batch" placeholder="Batch" value={formData.batch} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded" />
          <input type="text" name="pricePLN" placeholder="Cena (PLN)" value={formData.pricePLN} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded" />
          <input type="text" name="image_url" placeholder="URL obrazka" value={formData.image_url} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded" />
          <input type="text" name="link" placeholder="Link do produktu" value={formData.link} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded" />
          <input type="password" name="password" placeholder="Hasło" value={formData.password} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded" />
          <button type="submit" className="w-full p-2 bg-blue-600 rounded hover:bg-blue-500">Dodaj produkt</button>
        </form>
        {message && <p className="mt-4 text-center">{message}</p>}
      </main>
      <FooterSection />
      <FooterTwoSection />
    </div>
  );
}