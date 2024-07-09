import { DataTypes } from 'sequelize';
import sequelize from '../../config/mysqlConnet.js';

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'Categories',
    timestamps: false,
    underscored: true,
});

export default Category;
