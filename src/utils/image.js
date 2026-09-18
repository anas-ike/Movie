import { TMDB_IMAGE_BASE } from '../config/tmdb.js';
const fallback = '/images/placeholder-poster.svg';
function imageUrl(imagePath, size) { if (!imagePath || typeof imagePath !== 'string' || !imagePath.startsWith('/')) return fallback; return new URL(`${size}${imagePath}`, `${TMDB_IMAGE_BASE}/`).toString(); }
export const getPosterUrl = (imagePath, size = 'w500') => imageUrl(imagePath, size);
export const getBackdropUrl = (imagePath, size = 'w1280') => imageUrl(imagePath, size);
export const getProfileUrl = (imagePath, size = 'w185') => imageUrl(imagePath, size);
