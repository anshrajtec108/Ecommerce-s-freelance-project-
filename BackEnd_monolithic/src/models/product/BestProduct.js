import { DataTypes } from 'sequelize';
import sequelize from '../config/mysqlConnect.js';
import Product from './product.js';

const BestProduct = sequelize.define('BestProduct', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    underscored: true,
    tableName: 'Best_Products'
});

export default BestProduct;
