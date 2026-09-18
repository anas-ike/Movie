import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getPopularTV
} from '../services/tmdb.service.js';
import { getContinueWatching } from '../services/watch.service.js';

export async function homePage(req, res, next) {
  try {
    const [trending, popularMovies, topRatedMovies, nowPlayingMovies, popularTV] =
      await Promise.all([
        getTrendingMovies(),
        getPopularMovies(1),
        getTopRatedMovies(1),
        getNowPlayingMovies(1),
        getPopularTV(1)
      ]);

    let continueWatching = [];
    if (req.session.user) {
      continueWatching = await getContinueWatching(req.session.user.id, 12);
    }

    res.render('home', {
      pageTitle: 'LIGHTSOUT',
      metaDescription: 'Discover movies and TV shows with LIGHTSOUT.',
      heroItem: trending[0] || null,
      continueWatching,
      trending,
      popularMovies: popularMovies.results,
      topRatedMovies: topRatedMovies.results,
      nowPlayingMovies: nowPlayingMovies.results,
      popularTV: popularTV.results,
      tmdbConfigured: true
    });
  } catch (error) {
    if (error.code === 'TMDB_MISSING_KEY') {
      return res.render('home', {
        pageTitle: 'LIGHTSOUT',
        metaDescription: 'Discover movies and TV shows with LIGHTSOUT.',
        heroItem: null,
        continueWatching: [],
        trending: [],
        popularMovies: [],
        topRatedMovies: [],
        nowPlayingMovies: [],
        popularTV: [],
        tmdbConfigured: false
      });
    }
    next(error);
  }
}
