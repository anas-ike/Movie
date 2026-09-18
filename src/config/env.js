import dotenv from 'dotenv';
dotenv.config();

const bool = (value, fallback = false) => value === undefined ? fallback : ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase());
const list = (value = '') => value.split(',').map((item) => item.trim()).filter(Boolean);
function requiredUrl(name, value, fallback) {
  const raw = value || fallback;
  try {
    const url = new URL(raw);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('must use http or https');
    return url.origin;
  } catch (error) {
    throw new Error(`Invalid ${name}: expected an absolute http(s) URL without Markdown (received ${JSON.stringify(raw)})`);
  }
}
function optionalRedisUrl(value) {
  if (!value) return '';
  try {
    const url = new URL(value);
    if (!['redis:', 'rediss:'].includes(url.protocol)) throw new Error('unsupported protocol');
    return url.toString();
  } catch {
    throw new Error(`Invalid REDIS_URL: expected redis:// or rediss:// URL (received ${JSON.stringify(value)})`);
  }
}
const providers = {
  vidstuck: { enabled: bool(process.env.VIDSTUCK_ENABLED, true), name: 'VidStuck', origin: requiredUrl('VIDSTUCK_ORIGIN', process.env.VIDSTUCK_ORIGIN, 'https://vidstuck.xyz'), branding: process.env.VIDSTUCK_BRANDING || 'LIGHTSOUT', color: process.env.VIDSTUCK_COLOR || '8B5CF6', subtitle: process.env.VIDSTUCK_SUBTITLE || 'english', server: process.env.VIDSTUCK_SERVER || '', progress: bool(process.env.VIDSTUCK_PROGRESS, true), nextEpisode: bool(process.env.VIDSTUCK_NEXT_EPISODE, true), episodeSelector: bool(process.env.VIDSTUCK_EPISODE_SELECTOR, true), autoplayNextEpisode: bool(process.env.VIDSTUCK_AUTOPLAY_NEXT_EPISODE), overlay: bool(process.env.VIDSTUCK_OVERLAY, true) },
  vidfast: { enabled: bool(process.env.VIDFAST_ENABLED, true), name: 'VidFast', origin: requiredUrl('VIDFAST_ORIGIN', process.env.VIDFAST_ORIGIN, 'https://vidfast.vc'), theme: process.env.VIDFAST_THEME || '8B5CF6', server: process.env.VIDFAST_SERVER || '', servers: list(process.env.VIDFAST_SERVERS), hideServer: bool(process.env.VIDFAST_HIDE_SERVER), fullscreenButton: bool(process.env.VIDFAST_FULLSCREEN_BUTTON, true), chromecast: bool(process.env.VIDFAST_CHROMECAST, true), sub: process.env.VIDFAST_SUB || 'english', autoPlay: bool(process.env.VIDFAST_AUTOPLAY), autoNext: bool(process.env.VIDFAST_AUTONEXT, true), nextButton: bool(process.env.VIDFAST_NEXTBUTTON, true) },
  bingr: { enabled: bool(process.env.BINGR_ENABLED, true), name: 'Bingr', origin: requiredUrl('BINGR_ORIGIN', process.env.BINGR_ORIGIN, 'https://bingr.one') }
};
export const env = { nodeEnv: process.env.NODE_ENV || 'development', isProduction: process.env.NODE_ENV === 'production', host: process.env.HOST || '0.0.0.0', port: Number(process.env.PORT || 3000), databaseUrl: process.env.DATABASE_URL || '', redisUrl: optionalRedisUrl(process.env.REDIS_URL), sessionSecret: process.env.SESSION_SECRET || '', csrfSecret: process.env.CSRF_SECRET || '', tmdbApiKey: process.env.TMDB_API_KEY || '', tmdbLanguage: process.env.TMDB_LANGUAGE || 'en-US', siteName: process.env.SITE_NAME || 'LIGHTSOUT', siteUrl: requiredUrl('SITE_URL', process.env.SITE_URL, 'http://localhost:3000'), providers };
export function validateCriticalEnv() { const missing = []; if (!env.databaseUrl) missing.push('DATABASE_URL'); if (!env.sessionSecret || env.sessionSecret.length < 24) missing.push('SESSION_SECRET (minimum 24 characters)'); return { missing }; }
