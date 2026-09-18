import { getMovie, getPopularMovies, getTopRatedMovies, getNowPlayingMovies } from '../services/tmdb.service.js';
import { isFavorite } from '../services/user.service.js';

export async function moviesIndex(req, res, next) {
  try {
    const [popular, topRated, nowPlaying] = await Promise.all([
      getPopularMovies(1),
      getTopRatedMovies(1),
      getNowPlayingMovies(1)
    ]);

    res.render('movies', {
      pageTitle: 'Movies - LIGHTSOUT',
      metaDescription: 'Browse popular, top rated, and now playing movies.',
      popular: popular.results,
      topRated: topRated.results,
      nowPlaying: nowPlaying.results
    });
  } catch (error) {
    next(error);
  }
}

export async function movieDetail(req, res, next) {
  try {
    const movie = await getMovie(req.params.id);
    const favorite =
      req.session.user ? await isFavorite(req.session.user.id, movie.id, 'movie') : false;

    res.render('movie', {
      pageTitle: `${movie.title} - LIGHTSOUT`,
      metaDescription: movie.overview || `View details for ${movie.title}.`,
      movie,
      favorite
    });
  } catch (error) {
    error.status = 404;
    next(error);
  }
}
