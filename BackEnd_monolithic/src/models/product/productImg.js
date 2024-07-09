import { DataTypes } from 'sequelize';
import sequelize from '../../config/mysqlConnet.js';
import Product from './product.js';

const ProductImage = sequelize.define('ProductImage', {
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
    image_url: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    timestamps: false,
    underscored: true,
    tableName: 'Product_Images'
});

export default ProductImage;
