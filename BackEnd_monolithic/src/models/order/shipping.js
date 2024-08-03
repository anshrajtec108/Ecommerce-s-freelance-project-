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
        allowNull: false,
    },
    order_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Order,
            key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
    },
    address_line1: {
        type: DataTypes.STRING,
        // allowNull: false, // for the tesing the is true 
        allowNull: true,
    },
    address_line2: {
        type: DataTypes.STRING,
    },
    city: {
        type: DataTypes.STRING,
        // allowNull: false, // for the tesing the is true 
        allowNull: true,
    },
    state: {
        type: DataTypes.STRING,
        // allowNull: false, // for the tesing the is true 
        allowNull: true,
    },
    zip_code: {
        type: DataTypes.STRING,
        // allowNull: false, // for the tesing the is true 
        allowNull: true,
    },
    country: {
        type: DataTypes.STRING,
        // allowNull: false, // for the tesing the is true 
        allowNull: true,
    },
}, {
    tableName: 'Shipping_Addresses',
    timestamps: true,
    underscored: true,
});

export default ShippingAddress;
