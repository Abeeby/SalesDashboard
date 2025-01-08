export const COOKIE_CONFIG = {
  access_token: {
    name: 'access_token_web',
    domain: process.env.REACT_APP_COOKIE_DOMAIN,
    path: '/',
    secure: true,
    sameSite: 'none'
  },
  user_id: {
    name: 'user_id',
    domain: process.env.REACT_APP_COOKIE_DOMAIN,
    path: '/',
    secure: true,
    sameSite: 'none'
  },
  vinted_session: {
    name: '_vinted_fr_session',
    domain: '.vinted.fr',
    path: '/',
    secure: true,
    sameSite: 'none'
  }
}; 