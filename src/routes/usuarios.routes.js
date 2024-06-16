const express = require('express');
const {
  deleteUsuario,
  getUsuarios,
  loginUsuario,
  registerUsuario,
  updateUsuario,
  getUsuario,
  getUsuariosConRoles,
} = require('../controllers/usuarios.controller.js');
const { verificarToken } = require('../middleware/verificarToken.js');

const router = express.Router();

router.get('/usuarios', verificarToken, getUsuarios);
router.get('/usuarios/:id', verificarToken, getUsuario);
router.post('/getUsuariosConRoles', getUsuariosConRoles);
router.post('/usuarios/login', loginUsuario);
router.post('/usuarios/register', registerUsuario);
router.patch('/usuarios/:id', verificarToken, updateUsuario);
router.delete('/usuarios/:id', verificarToken, deleteUsuario);

module.exports = router;
