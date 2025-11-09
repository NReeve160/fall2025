export const requireRole = (role) => (req, res, next) => {
  // assumes requireAuth already attached req.user with { role }
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (req.user.role !== role && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};
