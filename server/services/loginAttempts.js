const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const incrAsync = promisify(client.incr).bind(client);

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60; // 15 minutes en secondes

async function checkLoginAttempts(email) {
  const attemptsKey = `login_attempts:${email}`;
  const lockKey = `login_lock:${email}`;

  // Vérifier si le compte est verrouillé
  const isLocked = await getAsync(lockKey);
  if (isLocked) {
    const ttl = await client.ttl(lockKey);
    throw new Error(`Compte temporairement verrouillé. Réessayez dans ${Math.ceil(ttl / 60)} minutes.`);
  }

  // Incrémenter le compteur de tentatives
  const attempts = await incrAsync(attemptsKey);
  
  // Définir une expiration si c'est la première tentative
  if (attempts === 1) {
    await client.expire(attemptsKey, 3600); // expire après 1 heure
  }

  // Vérifier si on doit verrouiller le compte
  if (attempts >= MAX_ATTEMPTS) {
    await setAsync(lockKey, '1', 'EX', LOCK_TIME);
    await client.del(attemptsKey);
    throw new Error(`Trop de tentatives. Compte verrouillé pour ${LOCK_TIME / 60} minutes.`);
  }

  return attempts;
}

async function resetLoginAttempts(email) {
  const attemptsKey = `login_attempts:${email}`;
  await client.del(attemptsKey);
}

module.exports = {
  checkLoginAttempts,
  resetLoginAttempts
}; 