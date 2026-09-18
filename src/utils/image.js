import { TMDB_IMAGE_BASE } from '../config/tmdb.js';

export function getPosterUrl(path, size = 'w500') {
  return path ? `${TMDB_IMAGE_BASE}/${size}${path}` : '/images/placeholder-poster.svg';
}

export function getBackdropUrl(path, size = 'w1280') {
  return path ? `${TMDB_IMAGE_BASE}/${size}${path}` : '/images/placeholder-poster.svg';
}

export function getProfileUrl(path, size = 'w185') {
  return path ? `${TMDB_IMAGE_BASE}/${size}${path}` : '/images/placeholder-poster.svg';
}
