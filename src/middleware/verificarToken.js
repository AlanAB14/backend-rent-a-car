const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config.js');

// Función de middleware para verificar el token
function verificarToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        const tokenValue = req.headers.authorization.split(' ')[1];
        const usuarioVerificado = jwt.verify(tokenValue, SECRET_KEY);
        req.usuario = usuarioVerificado;
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({ mensaje: 'Token no válido.' });
    }
}

module.exports = { verificarToken };
