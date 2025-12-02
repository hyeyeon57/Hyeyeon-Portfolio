const requireAuth = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  return res.redirect('/admin/login');
};

module.exports = { requireAuth };
