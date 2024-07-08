import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';
import Order from './order.js';

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    order_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Order,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    payment_method: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    payment_status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'Payments',
    timestamps: false,
    underscored: true,
});

export default Payment;
