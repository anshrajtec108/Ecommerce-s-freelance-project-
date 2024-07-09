import { DataTypes } from 'sequelize';
import sequelize from '../../config/mysqlConnet.js';
import Product from '../product/product.js';

const Discount = sequelize.define('Discount', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    product_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    discount_percentage: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    valid_from: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    valid_to: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'Discounts',
    timestamps: false,
    underscored: true,
});

export default Discount;
