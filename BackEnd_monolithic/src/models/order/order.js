import { DataTypes } from 'sequelize';
import sequelize from '../../config/mysqlConnet.js';
import User from '../user/user.models.js';

const Order = sequelize.define('Order', {
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
    total_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['pending', 'completed', 'cancelled']],
        },
    },
}, {
    tableName: 'Orders',
    timestamps: true,
    underscored: true,
});

export default Order;
