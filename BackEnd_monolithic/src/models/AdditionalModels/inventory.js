import { DataTypes } from 'sequelize';
import sequelize from '../../config/mysqlConnet.js';
import Product from '../product/product.js';

const Inventory = sequelize.define('Inventory', {
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
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'Inventory',
    timestamps: false,
    underscored: true,
});

export default Inventory;
