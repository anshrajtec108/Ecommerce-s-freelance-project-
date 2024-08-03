import dotenv from 'dotenv';
import sequelize from './config/mysqlConnet.js';
import app from './app.js';
import {
    User,
    Product,
    ProductImage,
    ProductVideo,
    BestProduct,
    Category,
    Order,
    OrderItem,
    Payment,
    ShippingAddress,
    Review,
    Coupon,
    Inventory,
    Discount,
    Cart,
    CartItem, } from './models/model_index.js';

dotenv.config();

const port = process.env.PORT || 8000;

const startServer = async () => {
    try {
        // await sequelize.sync({ force: true });
        await sequelize.sync();
        //  await sequelize.sync({ alter: true });
        console.log('Database & tables created!');

        const server = app.listen(port, () => {
            console.log(`Express server is running at PORT ${port}`);
        });

    } catch (error) {
        console.error('Unable to create tables:', error);
    }
};

startServer();
