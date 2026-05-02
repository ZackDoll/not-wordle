import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/client';
import { requireAuth, type AuthRequest } from '../middleware/requireAuth';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = Router();

router.post('/google', async (req, res) => {
  const { credential } = req.body as { credential: string };
  if (!credential) {
    res.status(400).json({ error: 'credential is required' });
    return;
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
      res.status(400).json({ error: 'Invalid Google credential' });
      return;
    }

    const { sub: googleId, email, name } = payload;

    let user = await prisma.user.findUnique({ where: { googleId } });
    if (!user) {
      let username = (name ?? email.split('@')[0])
        .replace(/[^a-zA-Z0-9_]/g, '')
        .slice(0, 20);
      const taken = await prisma.user.findUnique({ where: { username } });
      if (taken) username = username.slice(0, 15) + Math.floor(Math.random() * 99999);
      user = await prisma.user.create({ data: { googleId, email, username } });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '30d' });
    res.json({ token, user: { id: user.id, email: user.email, username: user.username } });
  } catch {
    res.status(401).json({ error: 'Invalid credential' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  const { userId } = req as AuthRequest;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, username: true },
  });
  if (!user) { res.status(404).json({ error: 'User not found' }); return; }
  res.json({ user });
});

export default router;
