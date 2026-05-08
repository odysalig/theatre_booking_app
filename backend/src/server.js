/*
  Αυτό είναι το αρχείο εκκίνησης του backend.
  Ξεκινάει τον server και δέχεται HTTP requests από το frontend
*/

require('dotenv').config();// Φορτώνει τις μεταβλητές από το .env

const app = require('./app');// Εισάγει το Express app που έχουμε ορίσει στο app.js

const PORT = process.env.PORT || 3000;// Παίρνει το port από το .env ή χρησιμοποιεί default 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);// Ξεκινάει τον server και "ακούει" για requests στο συγκεκριμένο port
});