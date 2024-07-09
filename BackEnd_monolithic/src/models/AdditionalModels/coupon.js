import { DataTypes } from 'sequelize';
import sequelize from '../../config/mysqlConnet.js';

const Coupon = sequelize.define('Coupon', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
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
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'Coupons',
    timestamps: false,
    underscored: true,
});

export default Coupon;
