// pages/api/products.js
import connectToDatabase from '../../lib/mongodb';
import Product from '../../models/Product';

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    const { category, bestbatch, sortOrder, name } = req.query;

    // Budowanie filtru na podstawie parametrów zapytania
    let filter = {};
    if (category) filter.category = category;
    if (bestbatch === 'true') filter.batch = { $ne: 'Random' };
    if (name) filter.name = new RegExp(name, 'i'); // Wyszukiwanie case-insensitive

    // Budowanie opcji sortowania
    let sort = {};
    if (sortOrder) {
      if (sortOrder === 'asc') {
        sort.price = 1; // Rosnąco
      } else if (sortOrder === 'desc') {
        sort.price = -1; // Malejąco
      }
    }

    // Pobieranie produktów z bazy danych z zastosowaniem filtru i sortowania
    const products = await Product.find(filter)
      .sort(sort)
      .lean();

    res.status(200).json({ results: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas pobierania produktów.' });
  }
}
