//Επιστρέφει τη λίστα όλων των θεάτρων από τη βάση δεδομένων, ώστε το frontend να μπορεί να τα εμφανίσει στον χρήστη

const db = require('../config/db');

exports.getAllTheatres = async (req, res) => { // Endpoint για επιστροφή όλων των θεάτρων
    try {
        // Παίρνει όλα τα θέατρα από τη βάση και τα ταξινομεί αλφαβητικά
        const [theatres] = await db.execute('SELECT * FROM theatres ORDER BY name ASC');

        return res.status(200).json(theatres); // Επιστρέφει τα θέατρα σε μορφή JSON
    } catch (error) { // Σε περίπτωση σφάλματος
        return res.status(500).json({ message: 'Error fetching theatres.', error: error.message });
    }
};