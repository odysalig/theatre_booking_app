/*
  Αυτό το αρχείο ορίζει τα endpoints που σχετίζονται με τις κρατήσεις.
  Συνδέει τα HTTP requests με τις αντίστοιχες functions του reservationController.
*/


const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController'); // Controller για κρατήσεις
const authMiddleware = require('../middleware/authMiddleware');// Middleware για έλεγχο JWT

router.post('/', authMiddleware, reservationController.createReservation);
// POST /reservations/
// Δημιουργεί νέα κράτηση
router.get('/my', authMiddleware, reservationController.getMyReservations);
// GET /reservations/my
// Επιστρέφει τις κρατήσεις του logged-in χρήστη
router.put('/:reservationId/cancel', authMiddleware, reservationController.cancelReservation);
// PUT /reservations/:reservationId/cancel
// Ακυρώνει μία κράτηση (αλλάζει status σε CANCELLED)
router.put('/:reservationId/update-seats', authMiddleware, reservationController.updateSeats); //Update-seats
module.exports = router;