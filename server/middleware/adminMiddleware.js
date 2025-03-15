const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Non autorisé: accès admin requis");
  }
};

module.exports = adminMiddleware;
