const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError, ValidationError } = require('sequelize');
const { Usuario } = require('../modelos');

const RONDAS_SALT = 10;

exports.registrar = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body || {};

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      typeof email !== 'string' ||
      !email.trim() ||
      typeof password !== 'string' ||
      password.length < 6
    ) {
      return res.status(400).json({
        message: 'Nombre, email y contraseña son obligatorios; la contraseña debe tener al menos 6 caracteres',
      });
    }

    const emailNormalizado = email.trim().toLowerCase();
    const existente = await Usuario.findOne({ where: { email: emailNormalizado } });
    if (existente) {
      return res.status(409).json({ message: 'Ya existe un usuario con ese email' });
    }

    const passwordHash = await bcrypt.hash(password, RONDAS_SALT);

    const usuario = await Usuario.create({
      name: name.trim(),
      email: emailNormalizado,
      passwordHash,
      phone: phone ? String(phone).replace(/\D/g, '') : null,
    });

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      id: usuario.id,
      name: usuario.name,
      email: usuario.email,
      phone: usuario.phone,
      role: usuario.role,
    });
  } catch (err) {
    console.error(err);
    if (err instanceof UniqueConstraintError) {
      return res.status(409).json({ message: 'Ya existe un usuario con ese email' });
    }
    if (err instanceof ValidationError) {
      return res.status(400).json({ message: err.errors[0]?.message || 'Datos de registro inválidos' });
    }
    return res.status(500).json({ message: 'Error registrando usuario' });
  }
};

exports.iniciarSesion = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    const usuario = await Usuario.findOne({ where: { email: email.trim().toLowerCase() } });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const valido = await bcrypt.compare(password, usuario.passwordHash);
    if (!valido) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        phone: usuario.phone,
        role: usuario.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error iniciando sesión' });
  }
};

exports.perfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.json({
      id: usuario.id,
      name: usuario.name,
      email: usuario.email,
      phone: usuario.phone,
      role: usuario.role,
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error obteniendo perfil' });
  }
};

exports.actualizarPerfil = async (req, res) => {
  try {
    const { name, email, phone } = req.body || {};

    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ message: 'El nombre no puede estar vacío' });
      }
      usuario.name = name.trim();
    }

    if (email !== undefined) {
      if (typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({ message: 'El email es obligatorio' });
      }
      const emailNormalizado = email.trim().toLowerCase();
      if (emailNormalizado !== usuario.email) {
        const existente = await Usuario.findOne({ where: { email: emailNormalizado } });
        if (existente) {
          return res.status(409).json({ message: 'Ya existe un usuario con ese email' });
        }
        usuario.email = emailNormalizado;
      }
    }

    if (phone !== undefined) {
      usuario.phone = phone ? String(phone).replace(/\D/g, '') : null;
    }

    await usuario.save();

    const actualizado = {
      id: usuario.id,
      name: usuario.name,
      email: usuario.email,
      phone: usuario.phone,
      role: usuario.role,
    };

    return res.json({
      message: 'Perfil actualizado correctamente',
      user: actualizado,
    });
  } catch (err) {
    console.error(err);
    if (err instanceof UniqueConstraintError) {
      return res.status(409).json({ message: 'Ya existe un usuario con ese email' });
    }
    if (err instanceof ValidationError) {
      return res.status(400).json({ message: err.errors[0]?.message || 'Datos de perfil inválidos' });
    }
    return res.status(500).json({ message: 'Error actualizando perfil' });
  }
};
