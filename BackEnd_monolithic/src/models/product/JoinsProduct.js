import Product from './product.js';
import ProductImage from './productImg.js';
import ProductVideo from './productVideo.js';
import BestProduct from './BestProduct.js';
import Category from './category.js';

// Define associations
Product.hasMany(ProductImage, { foreignKey: 'product_id' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasMany(ProductVideo, { foreignKey: 'product_id' });
ProductVideo.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasOne(BestProduct, { foreignKey: 'product_id' });
BestProduct.belongsTo(Product, { foreignKey: 'product_id' });

Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

export { Product, ProductImage, ProductVideo, BestProduct };
