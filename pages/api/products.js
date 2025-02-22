// pages/api/products.js
import connectToDatabase from '../../lib/mongodb';
import Product from '../../models/Product';

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    const { category, sort, search, limit = 50, skip = 0 } = req.query;

    const limitNum = parseInt(limit, 10) || 50;
    const skipNum = parseInt(skip, 10) || 0;

    let filter = {};
    
    if (category && category !== '') {
      filter.category = category;
    }
    
    if (search) {
      const searchTerms = search.trim().split(/\s+/);
      filter.$and = searchTerms.map(term => ({
        name: new RegExp(term, 'i')
      }));
    }

    let sortOptions = {};
    switch(sort) {
      case 'price_asc':
        sortOptions.price = 1;
        break;
      case 'price_desc':
        sortOptions.price = -1;
        break;
      default:
        sortOptions = { _id: -1 };
    }

    const totalCount = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sortOptions)
      .limit(limitNum)
      .skip(skipNum)
      .lean();

    res.status(200).json({ 
      results: products,
      totalCount,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas pobierania produktów.' });
  }
}