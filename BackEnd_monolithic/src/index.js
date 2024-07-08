import dotenv from 'dotenv';
import sequelize from './config/mysqlConnect.js';
import app from './app.js';
import { Product, ProductImage, ProductVideo, ProductURL, BestProduct } from './models/product/JoinsProduct.js';
import User from './models/user/user.models.js';
import Role from './models/user/role.models.js';

dotenv.config();

const port = process.env.PORT || 8000;

const startServer = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Database & tables created!');

        const server = app.listen(port, () => {
            console.log(`Express server is running at PORT ${port}`);
        });

    } catch (error) {
        console.error('Unable to create tables:', error);
    }
};

startServer();
