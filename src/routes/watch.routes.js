import { Router } from 'express';
import {
  getMovieEmbedApi,
  getTVEmbedApi,
  watchMoviePage,
  watchTVPage
} from '../controllers/watch.controller.js';

const router = Router();

router.get('/watch/movie/:id', watchMoviePage);
router.get('/watch/tv/:id/:season/:episode', watchTVPage);

router.get('/api/embed/movie/:id', getMovieEmbedApi);
router.get('/api/embed/tv/:id/:season/:episode', getTVEmbedApi);

export default router;
