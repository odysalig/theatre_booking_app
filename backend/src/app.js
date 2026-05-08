//Βασικό αρχείο ρύθμισης του backend

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const theatreRoutes = require('./routes/theatreRoutes');
const showRoutes = require('./routes/showRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();// Δημιουργεί το Express app

app.use(cors());// Επιτρέπει cross-origin requests
app.use(express.json());// Επιτρέπει στο backend να διαβάζει JSON από requests

app.use('/api/auth', authRoutes);
app.use('/api/theatres', theatreRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/reservations', reservationRoutes);

// Test endpoint για να δoύμε αν τρέχει το backend
app.get('/', (req, res) => {
    res.json({ message: 'Theatre Booking API is running' });
});

module.exports = app;