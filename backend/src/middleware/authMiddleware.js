/*
  Αυτό το αρχείο είναι middleware για authentication.
    Ελέγχει αν το request περιέχει έγκυρο JWT token.
    Αν είναι valid, επιτρέπει την πρόσβαση στο endpoint και προσθέτει τον χρήστη στο req.user.
    Αν όχι, μπλοκάρει το request.
*/


const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) { // Middleware function
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {// Αν δεν υπάρχει header ή δεν είναι της μορφής "Bearer token"
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    // Παίρνει το token μετά το "Bearer

    try {// Ελέγχει αν το token είναι valid με βάση το secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Αποθηκεύει τα δεδομένα του χρήστη (user_id, email) στο request
        next();// Συνεχίζει στο επόμενο middleware
    } catch (error) {// Αν το token είναι λάθος ή expired
        return res.status(401).json({ message: 'Invalid token.' });
    }
}

module.exports = authMiddleware;