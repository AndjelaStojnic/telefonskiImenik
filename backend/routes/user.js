const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getAllUsersWithPasswords,
  getUserById,
  createUser,
  verifyEmail,             // dodaj funkciju za verifikaciju mejla
  updateUser,
  deleteUser,
  login,
} = require('../controllers/user');

const authenticateToken = require('../middleware/authenticateToken');

// **Javni endpointi**
router.post('/login', login);            // login nema autentifikaciju
router.post('/', createUser);            // kreiranje korisnika javno
router.get('/verify-email', verifyEmail); // ruta za verifikaciju mejla (pre dinamičke)

// **Zaštićene rute** - samo ulogovani korisnici mogu pristupiti
router.get('/', authenticateToken, getAllUsers);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

// Ruta za razvoj koja vraća sve korisnike SA lozinkama (koristiti samo za razvoj!)
router.post('/all-with-passwords', authenticateToken, getAllUsersWithPasswords);

module.exports = router;
