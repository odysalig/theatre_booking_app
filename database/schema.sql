-- Δημιουργία βάσης δεδομένων
-- Δημιουργία πινάκων και σχέσεων

CREATE DATABASE IF NOT EXISTS theatre_booking_app;
USE theatre_booking_app;

CREATE TABLE users (
                       user_id INT AUTO_INCREMENT PRIMARY KEY,
                       name VARCHAR(100) NOT NULL,
                       email VARCHAR(100) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE theatres (
                          theatre_id INT AUTO_INCREMENT PRIMARY KEY,
                          name VARCHAR(120) NOT NULL,
                          location VARCHAR(120) NOT NULL,
                          description TEXT
);

CREATE TABLE shows (
                       show_id INT AUTO_INCREMENT PRIMARY KEY,
                       theatre_id INT NOT NULL,
                       title VARCHAR(150) NOT NULL,
                       description TEXT,
                       duration INT NOT NULL,
                       age_rating VARCHAR(20),
                       FOREIGN KEY (theatre_id) REFERENCES theatres(theatre_id)
                           ON DELETE CASCADE
                           ON UPDATE CASCADE
);

CREATE TABLE showtimes (
                           showtime_id INT AUTO_INCREMENT PRIMARY KEY,
                           show_id INT NOT NULL,
                           show_date DATE NOT NULL,
                           show_time TIME NOT NULL,
                           hall_name VARCHAR(100),
                           price DECIMAL(10,2) NOT NULL,
                           total_seats INT NOT NULL,
                           available_seats INT NOT NULL,
                           FOREIGN KEY (show_id) REFERENCES shows(show_id)
                               ON DELETE CASCADE
                               ON UPDATE CASCADE
);

CREATE TABLE reservations (
                              reservation_id INT AUTO_INCREMENT PRIMARY KEY,
                              user_id INT NOT NULL,
                              showtime_id INT NOT NULL,
                              seat_count INT NOT NULL,
                              status VARCHAR(20) DEFAULT 'ACTIVE',
                              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              FOREIGN KEY (user_id) REFERENCES users(user_id)
                                  ON DELETE CASCADE
                                  ON UPDATE CASCADE,
                              FOREIGN KEY (showtime_id) REFERENCES showtimes(showtime_id)
                                  ON DELETE CASCADE
                                  ON UPDATE CASCADE
);

INSERT INTO theatres (name, location, description) VALUES
                                                       ('National Theatre', 'Athens', 'Central theatre in Athens'),
                                                       ('Pallas Theatre', 'Athens', 'Popular theatre for major performances');

INSERT INTO shows (theatre_id, title, description, duration, age_rating) VALUES
                                                                             (1, 'Hamlet', 'Classic Shakespeare tragedy', 140, '13+'),
                                                                             (2, 'The Phantom Night', 'Modern mystery theatre performance', 110, '16+'),
                                                                              (1, 'Romeo and Juliet', 'Romantic tragedy by Shakespeare', 125, '12+');

INSERT INTO showtimes (show_id, show_date, show_time, hall_name, price, total_seats, available_seats) VALUES
                                                                                                          (1, '2026-04-10', '20:00:00', 'Main Hall', 18.00, 100, 100),
                                                                                                          (1, '2026-04-11', '21:00:00', 'Main Hall', 18.00, 100, 100),
                                                                                                          (2, '2026-04-12', '19:30:00', 'Red Hall', 22.00, 80, 80),
                                                                                                          (3, '2026-05-01', '20:00:00', 'Main Hall', 20.00, 100, 100),
                                                                                                          (3, '2026-05-02', '21:00:00', 'Main Hall', 20.00, 100, 100),
                                                                                                          (3, '2026-05-03', '19:30:00', 'Main Hall', 20.00, 100, 100);