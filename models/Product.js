// models/Product.js
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: String,
  batch: String,
  pricePLN: String,
  image_url: String,
  link: String,
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
