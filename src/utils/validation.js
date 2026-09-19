import { z } from 'zod';

export const numericIdSchema = z.coerce.number().int().positive();
export const seasonSchema = z.coerce.number().int().min(1).max(999);
export const episodeSchema = z.coerce.number().int().min(1).max(9999);

export const authRegisterSchema = z.object({
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email().max(255),
  password: z.string().min(8).max(128)
});

export const authLoginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128)
});

export const searchSchema = z.object({
  q: z.string().trim().min(1).max(100),
  page: z.coerce.number().int().min(1).max(500).optional().default(1)
});

export const providerSchema = z.string().regex(/^server-[1-9]\d*$/);

export const watchProgressSchema = z.object({
  tmdbId: z.coerce.number().int().positive(),
  mediaType: z.enum(['movie', 'tv']),
  season: z.coerce.number().int().min(1).max(999).nullable().optional(),
  episode: z.coerce.number().int().min(1).max(9999).nullable().optional(),
  progressSeconds: z.coerce.number().min(0).max(100000),
  durationSeconds: z.coerce.number().min(0).max(100000),
  progressPercent: z.coerce.number().min(0).max(100),
  provider: providerSchema
});

export const favoriteSchema = z.object({
  tmdbId: z.coerce.number().int().positive(),
  mediaType: z.enum(['movie', 'tv'])
});
