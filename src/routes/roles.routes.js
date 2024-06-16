const express = require('express');
const { getRoles } = require('../controllers/roles.controller.js');
const { verificarToken } = require('../middleware/verificarToken.js');

const router = express.Router();

router.get('/roles', verificarToken, getRoles);

module.exports = router;
