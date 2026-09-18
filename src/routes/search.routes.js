import { Router } from 'express';
import { searchPage } from '../controllers/search.controller.js';

const router = Router();

router.get('/search', searchPage);

export default router;
