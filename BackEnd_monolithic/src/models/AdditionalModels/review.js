import { DataTypes } from 'sequelize';
import sequelize from '../../config/mysqlConnet.js';
import User from '../user/user.models.js';
import Product from '../product/product.js';

const Review = sequelize.define('Review', {
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
    product_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'Reviews',
    timestamps: false,
    underscored: true,
});

export default Review;
