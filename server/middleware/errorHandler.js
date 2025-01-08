function errorHandler(err, req, res, next) {
  console.error('Erreur:', err);

  // Erreurs CORS
  if (err.name === 'CORSError') {
    return res.status(403).json({
      error: 'Erreur CORS',
      message: 'Accès non autorisé',
      details: err.message
    });
  }

  // Erreurs Firebase
  if (err.code && err.code.startsWith('storage/')) {
    return res.status(403).json({
      error: 'Erreur Firebase Storage',
      message: 'Problème d\'accès au stockage',
      details: err.message
    });
  }

  // Erreur par défaut
  res.status(500).json({
    error: 'Erreur serveur',
    message: err.message
  });
}

module.exports = errorHandler; 