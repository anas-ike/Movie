import { env } from './env.js';

export const TMDB_BASE_URL = '[api.themoviedb.org](https://api.themoviedb.org/3)';
export const TMDB_IMAGE_BASE = '[image.tmdb.org](https://image.tmdb.org/t/p)';

export async function tmdbFetch(path, params = {}) {
  if (!env.tmdbApiKey) {
    const error = new Error('TMDB API key is not configured');
    error.code = 'TMDB_MISSING_KEY';
    throw error;
  }

  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set('api_key', env.tmdbApiKey);
  url.searchParams.set('language', env.tmdbLanguage);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/json' }
  });

  if (!response.ok) {
    const error = new Error(`TMDB request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}
