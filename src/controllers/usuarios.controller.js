const { pool } = require('../db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config.js');

exports.getUsuarios = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
};

exports.getUsuariosConRoles = async (req, res) => {
    const { id } = req.body;
    try {
        const [rows] = await pool.query('CALL ObtenerUsuariosConRol(IFNULL(?, null))', [id]);
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
};

exports.getUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query('SELECT avatar, created_at, email, role_id, user_id, username FROM users WHERE user_id = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
};

exports.registerUsuario = async (req, res) => {
    const { username, password, role_id, email, first_name, last_name, avatar } = req.body;
    if (!username || !password || !email || !role_id) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    try {
        const [rowsUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rowsUser.length === 0) {
            const [rowsUserEmail] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
            if (rowsUserEmail.length === 0) {
                const hashPass = bcrypt.hashSync(password, 10);
                const [rows] = await pool.query('INSERT INTO users (username, password, role_id, email, first_name, last_name, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)', [username, hashPass, role_id, email, first_name, last_name, avatar]);
                if (rows.insertId) {
                    const token = jwt.sign({ username, role_id, user_id: rows.insertId }, SECRET_KEY, { expiresIn: '24h' });
                    res.status(200).send({
                        id: rows.insertId,
                        token
                    });
                } else {
                    return res.status(400).json({
                        message: 'No se pudo registrar usuario'
                    });
                }
            } else {
                return res.status(400).json({
                    message: 'El email ya fue utilizado'
                });
            }
        } else {
            return res.status(400).json({
                message: 'El nombre de usuario ya existe'
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
};

exports.loginUsuario = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    try {
        const [rowsUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rowsUser.length !== 0) {
            const coincide = bcrypt.compareSync(password, rowsUser[0].password);
            if (!coincide) {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }
            const token = jwt.sign({ username, role_id: rowsUser[0].role_id, user_id: rowsUser[0].user_id }, SECRET_KEY, { expiresIn: '24h' });
            res.status(200).json({ message: 'Inicio de sesión exitoso', token });
        } else {
            return res.status(400).json({
                message: 'El usuario no existe'
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
};

exports.updateUsuario = async (req, res) => {
    const { id } = req.params;
    let { password, role_id, avatar, first_name, last_name } = req.body;
    try {
        if (password) {
            password = bcrypt.hashSync(password, 10);
        }
        const result = await pool.query('UPDATE users set password = IFNULL(?, password), role_id = IFNULL(?, role_id), avatar = IFNULL(?, avatar), first_name = IFNULL(?, first_name), last_name = IFNULL(?, last_name) WHERE user_id = ?', [password, role_id, avatar, first_name, last_name, id]);
        if (result.affectedRows === 0) return res.status(404).json({
            message: 'Servicio not found'
        });

        const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [id]);

        res.send(rows[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
};

exports.deleteUsuario = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM users WHERE user_id = ?', [req.params.id]);
        if (result.affectedRows <= 0) return res.status(404).json({
            message: 'Servicio not found'
        });

        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
};
