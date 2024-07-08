import { DataTypes } from 'sequelize';
import sequelize from '../config/mysqlConnect.js';
import Product from './product.js';

const ProductVideo = sequelize.define('ProductVideo', {
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
    video_url: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    timestamps: false,
    underscored: true,
    tableName: 'Product_Videos'
});

export default ProductVideo;
