import { DataTypes } from 'sequelize';
import sequelize from '../../config/mysqlConnet.js';
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
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        // allowNull: false, // for the tesing the is true 
        allowNull: true,
    },
    payment_method: {
        type: DataTypes.STRING,
        // allowNull: false, // for the tesing the is true 
        allowNull: true,
    },
    payment_status: {
        type: DataTypes.STRING,
        // allowNull: false, // for the tesing the is true 
        allowNull: true,
    },
    stripe_receipt_url: {
        type: DataTypes.STRING,
        // allowNull: false, // for the tesing the is true 
        allowNull: true,
    },
    stripe_payment_intent_id: {
        type: DataTypes.STRING,
        // allowNull: false, // for the tesing the is true 
        allowNull: true,
    },
}, {
    tableName: 'Payments',
    timestamps: true,
    underscored: true,
});

export default Payment;
