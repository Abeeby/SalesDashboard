import express from 'express';
import { saveSession, loadSession } from '../session.mjs';

const router = express.Router();

router.post('/save-session', async (req, res) => {
  try {
    const { cookies } = req.body;
    await saveSession({
      cookies,
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'],
      browser: 'firefox'
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/check-session', async (req, res) => {
  try {
    const session = await loadSession();
    if (session && session.cookies._vinted_fr_session) {
      res.json({ isValid: true });
    } else {
      res.json({ isValid: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 