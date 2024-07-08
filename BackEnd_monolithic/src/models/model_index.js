import User from './User.js';
import Product from './Product.js';
import ProductImage from './ProductImage.js';
import ProductVideo from './ProductVideo.js';
import BestProduct from './BestProduct.js';
import Category from './Category.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import Payment from './Payment.js';
import ShippingAddress from './ShippingAddress.js';

// Define associations
Product.hasMany(ProductImage, { foreignKey: 'product_id' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasMany(ProductVideo, { foreignKey: 'product_id' });
ProductVideo.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasOne(BestProduct, { foreignKey: 'product_id' });
BestProduct.belongsTo(Product, { foreignKey: 'product_id' });

Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

Order.hasOne(Payment, { foreignKey: 'order_id' });
Payment.belongsTo(Order, { foreignKey: 'order_id' });

User.hasMany(ShippingAddress, { foreignKey: 'user_id' });
ShippingAddress.belongsTo(User, { foreignKey: 'user_id' });

Order.hasOne(ShippingAddress, { foreignKey: 'order_id' });
ShippingAddress.belongsTo(Order, { foreignKey: 'order_id' });

export {
    User,
    Product,
    ProductImage,
    ProductVideo,
    BestProduct,
    Category,
    Order,
    OrderItem,
    Payment,
    ShippingAddress,
};
