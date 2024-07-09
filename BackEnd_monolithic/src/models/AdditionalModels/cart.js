import { DataTypes } from 'sequelize';
import sequelize from '../../config/mysqlConnet.js';
import User from '../user/user.models.js';

const Cart = sequelize.define('Cart', {
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
}, {
    tableName: 'Carts',
    timestamps: false,
    underscored: true,
});

export default Cart;
