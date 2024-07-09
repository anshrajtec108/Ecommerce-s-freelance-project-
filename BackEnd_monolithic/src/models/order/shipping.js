import { DataTypes } from 'sequelize';
import sequelize from '../../config/mysqlConnet.js';
import User from '../user/user.models.js';
import Order from './order.js';

const ShippingAddress = sequelize.define('ShippingAddress', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    order_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Order,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    address_line1: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address_line2: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    zip_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'Shipping_Addresses',
    timestamps: false,
    underscored: true,
});

export default ShippingAddress;
