import { authLoginSchema, authRegisterSchema } from '../utils/validation.js';
import { findUserByEmail, registerUser, verifyPassword } from '../services/auth.service.js';
import { logger } from '../utils/logger.js';

export function loginPage(req, res) {
  res.render('login', {
    pageTitle: 'Login - LIGHTSOUT',
    metaDescription: 'Log in to LIGHTSOUT.',
    error: null
  });
}

export function registerPage(req, res) {
  res.render('register', {
    pageTitle: 'Register - LIGHTSOUT',
    metaDescription: 'Create your LIGHTSOUT account.',
    error: null
  });
}

export async function register(req, res, next) {
  try {
    const parsed = authRegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).render('register', {
        pageTitle: 'Register - LIGHTSOUT',
        metaDescription: 'Create your LIGHTSOUT account.',
        error: 'Invalid registration details.'
      });
    }

    const existing = await findUserByEmail(parsed.data.email);
    if (existing) {
      return res.status(400).render('register', {
        pageTitle: 'Register - LIGHTSOUT',
        metaDescription: 'Create your LIGHTSOUT account.',
        error: 'Email already in use.'
      });
    }

    const user = await registerUser(parsed.data);
    req.session.user = user;
    logger.info('user_registered', { userId: user.id, email: user.email });
    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const parsed = authLoginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).render('login', {
        pageTitle: 'Login - LIGHTSOUT',
        metaDescription: 'Log in to LIGHTSOUT.',
        error: 'Invalid login details.'
      });
    }

    const user = await findUserByEmail(parsed.data.email);
    if (!user) {
      return res.status(400).render('login', {
        pageTitle: 'Login - LIGHTSOUT',
        metaDescription: 'Log in to LIGHTSOUT.',
        error: 'Invalid email or password.'
      });
    }

    const valid = await verifyPassword(user.password_hash, parsed.data.password);
    if (!valid) {
      return res.status(400).render('login', {
        pageTitle: 'Login - LIGHTSOUT',
        metaDescription: 'Log in to LIGHTSOUT.',
        error: 'Invalid email or password.'
      });
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar_url: user.avatar_url
    };

    logger.info('user_logged_in', { userId: user.id });
    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
}

export function logout(req, res) {
  req.session.destroy(() => {
    res.redirect('/');
  });
}
