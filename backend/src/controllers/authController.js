//Authentication της εφαρμογής.
//Στο register δημιουργείται νέος χρήστης στη βάση MariaDB
//Στο login γίνεται έλεγχος email/password

const db = require('../config/db'); //Σύνδεση με τη βάση δεδομένων
const bcrypt = require('bcrypt'); //Για κρυπτογράφηση και έλεγχο password
const jwt = require('jsonwebtoken');//Για δημιουργία JWT token

exports.register = async (req, res) => { //Controller για εγγραφή νέου χρήστη
    try {
        console.log('REGISTER HIT'); //Debug μήνυμα
        console.log('REGISTER BODY:', req.body); //Εμφανίζει τα δεδομένα που έστειλα ο χρήστης

        const { name, email, password } = req.body; //Παίρνει αυτά τα στοιχεία από το request body

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' }); //Ελέγχει αν λείπει κάποιο πεδίο
        }

        const [existingUsers] = await db.execute( //Ψάχνει αν υπάρχει ήδη
            'SELECT user_id FROM users WHERE email = ?',
            [email]
        );

        console.log('EXISTING USERS:', existingUsers); //Debug για να δούμε αν βρέθηκε υπάρχων χρήστης

        if (existingUsers.length > 0) { //Αν υπάρχει το email βγάζει error
            return res.status(409).json({ message: 'Email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); //Hash τον κωδικό
        console.log('PASSWORD HASHED OK');

        const result = await db.execute( //Εισάγει τον νέο χρήστη στη βάση
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        console.log('INSERT RESULT:', result);

        return res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) { //Catch errors
        console.error('REGISTER ERROR FULL:', error);
        console.error('REGISTER ERROR MESSAGE:', error.message);

        return res.status(500).json({
            message: 'Server error during registration.',
            error: error.message
        });
    }
};

//Controller για login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body; //Παίρνει email και password

        if (!email || !password) { //Ελέγχει αν λείπει κάποιο
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const [users] = await db.execute( //Ψάχνει χρήστη με το email αυτό
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const user = users[0]; //Παίρνει τον πρώτο χρήστη που βρήκε
        const isMatch = await bcrypt.compare(password, user.password);//Συγκρίνει τους κωδικούς

        if (!isMatch) { //Εrror messages
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign( //Δημιουργεί JWT token
            { user_id: user.user_id, email: user.email }, //Δεδομένα που μπαίνουν μέσα στο token
            process.env.JWT_SECRET, //Μυστικό κλειδί από το .env
            { expiresIn: '1h' } //Το token λήγει σε 1 ώρα
        );

        return res.status(200).json({
            message: 'Login successful.',
            token, //Το επιστρέφει στο frontend
            user: { //Επιστρέφει τα βασικά στοιχεία χρήστη
                user_id: user.user_id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) { //Error messages
        return res.status(500).json({
            message: 'Server error during login.',
            error: error.message
        });
    }
};