import crypto from 'crypto';
import { env } from '../config/env.js';
import { getAvailableProviders } from '../services/providers/provider.manager.js';

export function localsMiddleware(req, res, next) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(24).toString('hex');
  }

  res.locals.siteName = env.siteName;
  res.locals.siteUrl = env.siteUrl;
  res.locals.user = req.session.user || null;
  res.locals.csrfToken = req.session.csrfToken;
  res.locals.availableProviders = getAvailableProviders();
  res.locals.currentPath = req.path;
  next();
}
