// pages/api/products.js
import connectToDatabase from '../../lib/mongodb';
import Product from '../../models/Product';

export default async function handler(req, res) {
  await connectToDatabase();

  const { category, bestbatch, sortOrder, name } = req.query;

  let filter = {};
  if (category) filter.category = category;
  if (bestbatch === 'true') filter.batch = { $ne: 'Random' };
  if (name) filter.name = new RegExp(name, 'i');

  let products = await Product.find(filter).lean();

  if (sortOrder) {
    products = products.sort((a, b) => {
      const priceA = parseFloat(a.price.replace('$', ''));
      const priceB = parseFloat(b.price.replace('$', ''));
      return sortOrder === 'desc' ? priceB - priceA : priceA - priceB;
    });
  }

  res.status(200).json({ results: products });
}
