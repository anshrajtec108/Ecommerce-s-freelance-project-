import express from 'express';
import { creaeCookies } from '../controllers/testing.controller.js';


const router = express.Router();

router.get('/creaeCookies', creaeCookies)

export default router;