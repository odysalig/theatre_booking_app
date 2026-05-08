//Αυτό το αρχείο διαχειρίζεται την προβολή των παραστάσεων και των διαθέσιμων ωρών

const db = require('../config/db');

exports.getAllShows = async (req, res) => { // Επιστρέφει όλες τις παραστάσεις με φίλτρα
    try {
        const { theatreId, title, date } = req.query; // Παίρνει φίλτρα από query params

        let sql = `
      SELECT s.show_id, s.title, s.description, s.duration, s.age_rating,
             t.theatre_id, t.name AS theatre_name, t.location
      FROM shows s
      JOIN theatres t ON s.theatre_id = t.theatre_id
      WHERE 1=1
    `;

        const params = [];

        if (theatreId) { // Αν δοθεί theatreId
            sql += ' AND s.theatre_id = ?'; // Φιλτράρει με βάση το θέατρο
            params.push(theatreId); // Προσθέτει την τιμή στον πίνακα παραμέτρων
        }

        if (title) { // Αν δοθεί τίτλος
            sql += ' AND s.title LIKE ?';
            params.push(`%${title}%`);
        }

        if (date) { // Αν δοθεί ημερομηνία
            sql += ` AND s.show_id IN (
        SELECT show_id FROM showtimes WHERE show_date = ?
      )`;
            params.push(date);// Φέρνει μόνο τις παραστάσεις που έχουν showtime τη συγκεκριμένη μέρα
        }

        sql += ' ORDER BY s.title ASC';

        const [shows] = await db.execute(sql, params);
        return res.status(200).json(shows);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching shows.', error: error.message });
    }
};

exports.getShowtimesByShowId = async (req, res) => { // Επιστρέφει τα showtimes μιας παράστασης
    try {
        const { showId } = req.params;// Παίρνει το showId από το URL

        const [showtimes] = await db.execute(
            'SELECT * FROM showtimes WHERE show_id = ? ORDER BY show_date ASC, show_time ASC',
            [showId]
        );

        return res.status(200).json(showtimes);// Επιστρέφει τις διαθέσιμες ημερομηνίες/ώρες
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching showtimes.', error: error.message });
    }
};