import { DataTypes } from 'sequelize';
import sequelize from '../../config/mysqlConnet.js';
import Cart from './cart.js';
import Product from '../product/product.js';

const CartItem = sequelize.define('CartItem', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    cart_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Cart,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    product_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'Cart_Items',
    timestamps: false,
    underscored: true,
});

export default CartItem;
