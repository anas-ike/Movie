import { env } from '../../config/env.js';
import { buildVidStuckMovieEmbed, buildVidStuckTVEmbed } from './vidstuck.provider.js';
import { buildVidFastMovieEmbed, buildVidFastTVEmbed } from './vidfast.provider.js';
import { buildBingrMovieEmbed, buildBingrTVEmbed } from './bingr.provider.js';

const providers = {
  vidstuck: { ...env.providers.vidstuck, supports: { movie: true, tv: true, subtitle: true, autoplay: false, nextEpisode: true, episodeSelector: true } },
  vidfast: { ...env.providers.vidfast, supports: { movie: true, tv: true, subtitle: true, autoplay: true, nextEpisode: true, episodeSelector: false } },
  bingr: { ...env.providers.bingr, supports: { movie: true, tv: true, subtitle: false, autoplay: false, nextEpisode: false, episodeSelector: false } }
};
function assertProviderEnabled(key) { const config = providers[key]; if (!config?.enabled) { const error = new Error('Selected server is unavailable'); error.code = 'SERVER_UNAVAILABLE'; throw error; } return config; }
export function getAvailableProviders() { return Object.entries(providers).filter(([, config]) => config.enabled).map(([key, config]) => ({ key, name: config.name, origin: config.origin, supports: config.supports })); }
/** Public-facing server metadata intentionally contains no provider identity or origin. */
export function getAvailableServers() { return getAvailableProviders().map((provider, index) => ({ id: `server-${index + 1}`, label: `Server ${index + 1}`, supports: provider.supports })); }
function providerForServer(serverId) { const index = /^server-(\d+)$/.exec(String(serverId))?.[1]; const provider = getAvailableProviders()[Number(index) - 1]; if (!provider) { const error = new Error('Selected server is unavailable'); error.code = 'SERVER_UNAVAILABLE'; throw error; } return provider.key; }
export const getProviderOrigins = () => getAvailableProviders().map((provider) => provider.origin);
export const getProviderConfig = (provider) => providers[provider] || null;
export function getMovieEmbed(provider, id, options = {}) { const config = assertProviderEnabled(provider); if (provider === 'vidstuck') return buildVidStuckMovieEmbed(config, id, options); if (provider === 'vidfast') return buildVidFastMovieEmbed(config, id, options); if (provider === 'bingr') return buildBingrMovieEmbed(config, id); throw new Error('Unsupported provider'); }
export function getTVEmbed(provider, id, season, episode, options = {}) { const config = assertProviderEnabled(provider); if (provider === 'vidstuck') return buildVidStuckTVEmbed(config, id, season, episode, options); if (provider === 'vidfast') return buildVidFastTVEmbed(config, id, season, episode, options); if (provider === 'bingr') return buildBingrTVEmbed(config, id, season, episode); throw new Error('Unsupported provider'); }
export function getMovieEmbedForServer(serverId, id, options = {}) { return getMovieEmbed(providerForServer(serverId), id, options); }
export function getTVEmbedForServer(serverId, id, season, episode, options = {}) { return getTVEmbed(providerForServer(serverId), id, season, episode, options); }
export function getProviderKeyForServer(serverId) { return providerForServer(serverId); }
