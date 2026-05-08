//Διαχειρίζεται τις κρατήσεις της εφαρμογής

const db = require('../config/db'); // Εισάγει τη σύνδεση με τη MariaDB

exports.createReservation = async (req, res) => { // Δημιουργία νέας κράτησης
    const connection = await db.getConnection();

    try {
        const { showtime_id, seat_count } = req.body; // Παίρνει το showtime και τον αριθμό θέσεων από το body
        const user_id = req.user.user_id; // Παίρνει το user_id από το JWT middleware

        if (!showtime_id || !seat_count) { // Έλεγχος αν λείπουν απαραίτητα πεδία
            return res.status(400).json({ message: 'Showtime and seat count are required.' });
        }

        await connection.beginTransaction(); // Ξεκινά transaction

        // Κλειδώνει προσωρινά το συγκεκριμένο showtime μέχρι να τελειώσει το transaction
        const [showtimeRows] = await connection.execute(
            'SELECT * FROM showtimes WHERE showtime_id = ? FOR UPDATE',
            [showtime_id]
        );

        if (showtimeRows.length === 0) { // Αν δεν υπάρχει το showtime
            await connection.rollback(); // Ακυρώνει το transaction
            return res.status(404).json({ message: 'Showtime not found.' });
        }

        const showtime = showtimeRows[0]; // Παίρνει τα στοιχεία του showtime

        if (showtime.available_seats < seat_count) { // Ελέγχει αν υπάρχουν αρκετές διαθέσιμες θέσεις
            await connection.rollback();
            return res.status(400).json({ message: 'Not enough available seats.' });
        }

        // Δημιουργεί νέα ενεργή κράτηση
        await connection.execute(
            'INSERT INTO reservations (user_id, showtime_id, seat_count, status) VALUES (?, ?, ?, ?)',
            [user_id, showtime_id, seat_count, 'ACTIVE']
        );

        // Μειώνει τις διαθέσιμες θέσεις του συγκεκριμένου showtime
        await connection.execute(
            'UPDATE showtimes SET available_seats = available_seats - ? WHERE showtime_id = ?',
            [seat_count, showtime_id]
        );

        await connection.commit(); // Οριστικοποιεί τις αλλαγές στη βάση

        return res.status(201).json({ message: 'Reservation created successfully.' }); // Επιτυχής απάντηση

    } catch (error) {
        await connection.rollback(); // Σε περίπτωση error ακυρώνει όλες τις αλλαγές
        return res.status(500).json({
            message: 'Error creating reservation.',
            error: error.message
        });
    } finally {
        connection.release();
    }
};

// Επιστρέφει τις κρατήσεις του logged-in χρήστη
exports.getMyReservations = async (req, res) => {
    try {
        const user_id = req.user.user_id;  // Παίρνει το user_id από το JWT token

        const [reservations] = await db.execute(
            `SELECT r.reservation_id, r.seat_count, r.status, r.created_at,
                    st.show_date, st.show_time, st.hall_name, st.price,
                    s.title, t.name AS theatre_name
             FROM reservations r
                      JOIN showtimes st ON r.showtime_id = st.showtime_id
                      JOIN shows s ON st.show_id = s.show_id
                      JOIN theatres t ON s.theatre_id = t.theatre_id
             WHERE r.user_id = ?
             ORDER BY st.show_date ASC, st.show_time ASC`,
            [user_id]  // Φέρνει κρατήσεις μαζί με στοιχεία παράστασης, ώρας και θεάτρου
        );

        return res.status(200).json(reservations); // Επιστρέφει τις κρατήσεις σε JSON

    } catch (error) {
        return res.status(500).json({
            message: 'Error fetching reservations.',
            error: error.message
        });
    }
};

// Ακύρωση κράτησης
exports.cancelReservation = async (req, res) => {
    const connection = await db.getConnection();  // Παίρνει σύνδεση για transaction

    try {
        const { reservationId } = req.params;// Παίρνει το reservationId από το URL
        const user_id = req.user.user_id; // Παίρνει τον χρήστη από το JWT

        await connection.beginTransaction();

        const [reservationRows] = await connection.execute(
            'SELECT * FROM reservations WHERE reservation_id = ? AND user_id = ? AND status = ? FOR UPDATE',
            [reservationId, user_id, 'ACTIVE']  // Βρίσκει και κλειδώνει την ενεργή κράτηση του συγκεκριμένου χρήστη
        );

        if (reservationRows.length === 0) {// Αν δεν υπάρχει ή έχει ήδη ακυρωθεί
            await connection.rollback(); // Ακυρώνει transaction
            return res.status(404).json({ message: 'Reservation not found or already cancelled.' });
        }

        const reservation = reservationRows[0];// Παίρνει τα στοιχεία της κράτησης

        await connection.execute(
            'UPDATE reservations SET status = ? WHERE reservation_id = ?',
            ['CANCELLED', reservationId] // Αλλάζει την κατάσταση της κράτησης σε CANCELLED
        );

        await connection.execute(
            'UPDATE showtimes SET available_seats = available_seats + ? WHERE showtime_id = ?',
            [reservation.seat_count, reservation.showtime_id]
        );

        await connection.commit();// Οριστικοποιεί τις αλλαγές

        return res.status(200).json({ message: 'Reservation cancelled successfully.' });

    } catch (error) {
        await connection.rollback();
        return res.status(500).json({
            message: 'Error cancelling reservation.',
            error: error.message
        });
    } finally {
        connection.release();
    }
};

exports.updateSeats = async (req, res) => {
    const connection = await db.getConnection();

    try {
        const { reservationId } = req.params;
        const { seat_count } = req.body;
        const user_id = req.user.user_id;

        if (!seat_count || seat_count <= 0) {
            return res.status(400).json({ message: 'Invalid seat count.' });
        }

        await connection.beginTransaction();

        const [rows] = await connection.execute(
            'SELECT * FROM reservations WHERE reservation_id = ? AND user_id = ? AND status = ? FOR UPDATE',
            [reservationId, user_id, 'ACTIVE']
        );

        if (rows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Reservation not found.' });
        }

        const reservation = rows[0];

        const diff = seat_count - reservation.seat_count;

        const [showtimeRows] = await connection.execute(
            'SELECT * FROM showtimes WHERE showtime_id = ? FOR UPDATE',
            [reservation.showtime_id]
        );

        const showtime = showtimeRows[0];

        if (diff > 0 && showtime.available_seats < diff) {
            await connection.rollback();
            return res.status(400).json({ message: 'Not enough available seats.' });
        }

        await connection.execute(
            'UPDATE reservations SET seat_count = ? WHERE reservation_id = ?',
            [seat_count, reservationId]
        );

        await connection.execute(
            'UPDATE showtimes SET available_seats = available_seats - ? WHERE showtime_id = ?',
            [diff, reservation.showtime_id]
        );

        await connection.commit();

        return res.status(200).json({ message: 'Reservation updated.' });

    } catch (error) {
        await connection.rollback();
        return res.status(500).json({ message: 'Error updating reservation.' });
    } finally {
        connection.release();
    }
};