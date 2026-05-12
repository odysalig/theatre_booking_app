//Αυτό το αρχείο ορίζει τα endpoints που σχετίζονται με τις παραστάσεις (shows)
//και τα διαθέσιμα showtimes.

const express = require('express');
const router = express.Router();
const showController = require('../controllers/showController');// Εισάγει τον controller

router.get('/', showController.getAllShows);
// GET /shows/
// Επιστρέφει όλες τις παραστάσεις
router.get('/:showId/showtimes', showController.getShowtimesByShowId); //GET /api/shows/:showID/showtimes
// GET /shows/:showId/showtimes
// Επιστρέφει τα showtimes για συγκεκριμένη παράσταση

module.exports = router;