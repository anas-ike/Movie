import { env } from './env.js';
<<<<<<< ours
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
export async function tmdbFetch(path, params = {}) {
  if (!env.tmdbApiKey) { const error = new Error('TMDB API key is not configured'); error.code = 'TMDB_MISSING_KEY'; throw error; }
  const url = new URL(path, `${TMDB_BASE_URL}/`);
  url.searchParams.set('api_key', env.tmdbApiKey); url.searchParams.set('language', env.tmdbLanguage);
  for (const [key, value] of Object.entries(params)) if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) { const error = new Error(`TMDB request failed: ${response.status}`); error.status = response.status; throw error; }
=======

export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export async function tmdbFetch(path, params = {}) {
  if (!env.tmdbApiKey) {
    const error = new Error('TMDB API key is not configured');
    error.code = 'TMDB_MISSING_KEY';
    throw error;
  }

  // Service callers use leading slashes; strip them so the /3 API segment is retained.
  const url = new URL(path.replace(/^\/+/, ''), `${TMDB_BASE_URL}/`);
  url.searchParams.set('api_key', env.tmdbApiKey);
  url.searchParams.set('language', env.tmdbLanguage);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    const error = new Error(`TMDB request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }
<<<<<<< ours
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
  return response.json();
}
