import { Router } from 'express';
import { movieDetail, moviesIndex } from '../controllers/movie.controller.js';

const router = Router();

router.get('/movies', moviesIndex);
router.get('/movies/popular', moviesIndex);
router.get('/movies/top-rated', moviesIndex);
router.get('/movies/now-playing', moviesIndex);
router.get('/movie/:id', movieDetail);

export default router;
