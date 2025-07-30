import connectToDatabase from '../../lib/mongodb';
import Product from '../../models/Product';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, category, price, batch, pricePLN, image_url, link, password } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await connectToDatabase();
    const newProduct = new Product({
      name,
      category,
      price,
      batch,
      pricePLN,
      image_url,
      link
    });
    await newProduct.save();
    res.status(201).json({ message: 'Produkt dodany pomyślnie' });
  } catch (error) {
    res.status(500).json({ error: 'Błąd podczas dodawania produktu' });
  }
}