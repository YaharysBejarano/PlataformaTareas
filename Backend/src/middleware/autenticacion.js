const jwt = require('jsonwebtoken');

function autenticacion(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

module.exports = autenticacion;
