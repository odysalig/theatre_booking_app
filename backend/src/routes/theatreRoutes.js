//Αυτό το αρχείο ορίζει τα endpoints που σχετίζονται με τα θέατρα.
//   Συνδέει τα HTTP requests με τον theatreController.

const express = require('express');
const router = express.Router();
const theatreController = require('../controllers/theatreController');// Εισάγει τον controller

router.get('/', theatreController.getAllTheatres);
// GET /theatres/
// Επιστρέφει όλα τα θέατρα από τη βάση δεδομένων

module.exports = router;