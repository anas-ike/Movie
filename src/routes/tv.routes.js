import { Router } from 'express';
import { tvDetail, tvIndex, tvSeasonDetail } from '../controllers/tv.controller.js';

const router = Router();

router.get('/tv', tvIndex);
router.get('/tv/popular', tvIndex);
router.get('/tv/top-rated', tvIndex);
router.get('/tv/:id', tvDetail);
router.get('/tv/:id/season/:season', tvSeasonDetail);

export default router;
