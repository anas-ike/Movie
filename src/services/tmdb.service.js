import { tmdbFetch } from '../config/tmdb.js';
import { getCache, setCache } from './cache.service.js';
import { getPosterUrl, getBackdropUrl, getProfileUrl } from '../utils/image.js';

function normalizeMedia(item, mediaTypeOverride = null) {
  const mediaType = mediaTypeOverride || item.media_type || (item.title ? 'movie' : 'tv');
  return {
    id: item.id,
    mediaType,
    title: item.title || item.name,
    originalTitle: item.original_title || item.original_name,
    overview: item.overview || '',
    posterPath: item.poster_path,
    backdropPath: item.backdrop_path,
    posterUrl: getPosterUrl(item.poster_path),
    backdropUrl: getBackdropUrl(item.backdrop_path),
    rating: item.vote_average || 0,
    year: (item.release_date || item.first_air_date || '').slice(0, 4),
    releaseDate: item.release_date || item.first_air_date || '',
    genres: item.genres || [],
    genreIds: item.genre_ids || []
  };
}

async function cached(key, ttl, fn) {
  const hit = await getCache(key);
  if (hit) return hit;
  const data = await fn();
  await setCache(key, data, ttl);
  return data;
}

export async function getMovie(id) {
  return cached(`movie:${id}`, 21600, async () => {
    const data = await tmdbFetch(`/movie/${id}`, {
      append_to_response: 'credits,recommendations,videos'
    });

    return {
      ...normalizeMedia(data, 'movie'),
      runtime: data.runtime,
      status: data.status,
      originalLanguage: data.original_language,
      productionCompanies: data.production_companies || [],
      spokenLanguages: data.spoken_languages || [],
      credits: {
        cast: (data.credits?.cast || []).slice(0, 12).map((p) => ({
          id: p.id,
          name: p.name,
          character: p.character,
          profileUrl: getProfileUrl(p.profile_path)
        })),
        crew: data.credits?.crew || []
      },
      director:
        (data.credits?.crew || []).find((c) => c.job === 'Director')?.name || null,
      recommendations: (data.recommendations?.results || []).map((r) =>
        normalizeMedia(r, 'movie')
      ),
      videos: data.videos?.results || []
    };
  });
}

export async function getPopularMovies(page = 1) {
  return cached(`popular:movies:${page}`, 3600, async () => {
    const data = await tmdbFetch('/movie/popular', { page });
    return { ...data, results: data.results.map((m) => normalizeMedia(m, 'movie')) };
  });
}

export async function getTopRatedMovies(page = 1) {
  return cached(`top-rated:movies:${page}`, 21600, async () => {
    const data = await tmdbFetch('/movie/top_rated', { page });
    return { ...data, results: data.results.map((m) => normalizeMedia(m, 'movie')) };
  });
}

export async function getNowPlayingMovies(page = 1) {
  return cached(`now-playing:movies:${page}`, 3600, async () => {
    const data = await tmdbFetch('/movie/now_playing', { page });
    return { ...data, results: data.results.map((m) => normalizeMedia(m, 'movie')) };
  });
}

export async function getTrendingMovies() {
  return cached('trending:day', 1800, async () => {
    const data = await tmdbFetch('/trending/all/day');
    return data.results.map((m) => normalizeMedia(m));
  });
}

export async function getTV(id) {
  return cached(`tv:${id}`, 21600, async () => {
    const data = await tmdbFetch(`/tv/${id}`, {
      append_to_response: 'credits,recommendations,videos'
    });

    return {
      ...normalizeMedia(data, 'tv'),
      numberOfSeasons: data.number_of_seasons,
      numberOfEpisodes: data.number_of_episodes,
      status: data.status,
      seasons: (data.seasons || []).map((s) => ({
        id: s.id,
        seasonNumber: s.season_number,
        name: s.name,
        episodeCount: s.episode_count,
        posterUrl: getPosterUrl(s.poster_path)
      })),
      cast: (data.credits?.cast || []).slice(0, 12).map((p) => ({
        id: p.id,
        name: p.name,
        character: p.character,
        profileUrl: getProfileUrl(p.profile_path)
      })),
      recommendations: (data.recommendations?.results || []).map((r) =>
        normalizeMedia(r, 'tv')
      )
    };
  });
}

export async function getTVSeason(id, season) {
  return cached(`tv:${id}:season:${season}`, 21600, async () => {
    const data = await tmdbFetch(`/tv/${id}/season/${season}`);
    return {
      id: data.id,
      name: data.name,
      overview: data.overview,
      seasonNumber: data.season_number,
      posterUrl: getPosterUrl(data.poster_path),
      episodes: (data.episodes || []).map((ep) => ({
        id: ep.id,
        episodeNumber: ep.episode_number,
        seasonNumber: ep.season_number,
        name: ep.name,
        overview: ep.overview,
        runtime: ep.runtime,
        airDate: ep.air_date,
        stillUrl: getBackdropUrl(ep.still_path, 'w780')
      }))
    };
  });
}

export async function getPopularTV(page = 1) {
  return cached(`popular:tv:${page}`, 3600, async () => {
    const data = await tmdbFetch('/tv/popular', { page });
    return { ...data, results: data.results.map((m) => normalizeMedia(m, 'tv')) };
  });
}

export async function getTopRatedTV(page = 1) {
  return cached(`top-rated:tv:${page}`, 21600, async () => {
    const data = await tmdbFetch('/tv/top_rated', { page });
    return { ...data, results: data.results.map((m) => normalizeMedia(m, 'tv')) };
  });
}

export async function searchMulti(query, page = 1) {
  return cached(`search:${query}:${page}`, 300, async () => {
    const data = await tmdbFetch('/search/multi', { query, page, include_adult: false });
    return {
      ...data,
      results: data.results
        .filter((r) => ['movie', 'tv'].includes(r.media_type))
        .map((r) => normalizeMedia(r))
    };
  });
}

export async function getMovieGenres() {
  return tmdbFetch('/genre/movie/list');
}

export async function getTVGenres() {
  return tmdbFetch('/genre/tv/list');
}

export async function getGenres() {
  const [movies, tv] = await Promise.all([getMovieGenres(), getTVGenres()]);
  return { movie: movies.genres || [], tv: tv.genres || [] };
}
