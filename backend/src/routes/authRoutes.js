/*
  Αυτό το αρχείο ορίζει τα endpoints που σχετίζονται με το authentication.
  Συνδέει τα HTTP requests (register, login) με τις αντίστοιχες functions του authController.
*/

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');// Εισάγει τον controller

router.post('/register', authController.register);// Endpoint για εγγραφή χρήστη
router.post('/login', authController.login);// Endpoint για login χρήστη

module.exports = router;// Εξάγει το router για χρήση στο server.js