import User from './user/user.models.js';
import Role from './user/role.models.js';
import Product from './product/product.js';
import ProductImage from './product/productImg.js';
import ProductVideo from './product/productVideo.js';
import BestProduct from './product/BestProduct.js';
import Category from './product/category.js';
import Order from './order/order.js';
import OrderItem from './order/OrderItem.js';
import Payment from './order/payment.js';
import ShippingAddress from './order/shipping.js';
import Review from './AdditionalModels/review.js';
import Coupon from './AdditionalModels/Coupon.js';
import Inventory from './AdditionalModels/inventory.js';
import Discount from './AdditionalModels/discount.js';
import Cart from './AdditionalModels/cart.js';
import CartItem from './AdditionalModels/cartItem.js';
import Seller from './User/Seller.js';

// Define associations
Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });
Seller.belongsTo(Role, { foreignKey: 'role_id' });

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

Product.hasMany(Review, { foreignKey: 'product_id' });
Review.belongsTo(Product, { foreignKey: 'product_id' });

User.hasMany(Review, { foreignKey: 'user_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });

Product.hasMany(Inventory, { foreignKey: 'product_id' });
Inventory.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasMany(Discount, { foreignKey: 'product_id' });
Discount.belongsTo(Product, { foreignKey: 'product_id' });

User.hasMany(Cart, { foreignKey: 'user_id' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

Cart.hasMany(CartItem, { foreignKey: 'cart_id' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });

Product.hasMany(CartItem, { foreignKey: 'product_id' });
CartItem.belongsTo(Product, { foreignKey: 'product_id' });

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
    Review,
    Coupon,
    Inventory,
    Discount,
    Cart,
    CartItem,
};
