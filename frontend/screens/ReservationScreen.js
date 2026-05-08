//Οθόνη κρατήσεων

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import api from '../services/api';
import { getToken } from '../services/authStorage';

export default function ReservationScreen({ route, navigation }) {
    const { showtime } = route.params;
    const [seatCount, setSeatCount] = useState('1');

    const formatDate = (dateValue) => {
        return new Date(dateValue).toLocaleDateString();
    };

    const formatTime = (timeValue) => {
        if (!timeValue) return '';
        if (timeValue.includes('T')) {
            return new Date(timeValue).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return timeValue.slice(0, 5);
    };

    const handleReservation = async () => {
        if (!seatCount || isNaN(seatCount)) {
            Alert.alert('Error', 'Please enter a valid number');
            return;
        }

        const seats = Number(seatCount);

        if (seats <= 0) {
            Alert.alert('Error', 'Seat count must be greater than 0');
            return;
        }

        if (seats > showtime.available_seats) {
            Alert.alert('Error', 'Not enough available seats');
            return;
        }

        try {
            const token = await getToken();

            await api.post(
                '/reservations',
                {
                    showtime_id: showtime.showtime_id,
                    seat_count: seats
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            Alert.alert('Success', 'Reservation completed successfully');
            navigation.navigate('MyReservations');

        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Reservation failed');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Book Reservation</Text>
            <Text style={styles.subtitle}>Confirm your theatre booking</Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Selected Showtime</Text>

                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>📅 Date: {formatDate(showtime.show_date)}</Text>
                    <Text style={styles.infoText}>🕒 Time: {formatTime(showtime.show_time)}</Text>
                    <Text style={styles.infoText}>🏛️ Hall: {showtime.hall_name}</Text>
                    <Text style={styles.infoText}>💶 Price: €{showtime.price}</Text>
                    <Text style={styles.infoText}>🎟️ Available Seats: {showtime.available_seats}</Text>
                </View>

                <Text style={styles.label}>Number of seats</Text>

                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={seatCount}
                    onChangeText={setSeatCount}
                    placeholder="Number of seats"
                    placeholderTextColor="#94a3b8"
                />

                <TouchableOpacity style={styles.button} onPress={handleReservation}>
                    <Text style={styles.buttonText}>Confirm Reservation</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 18,
        backgroundColor: '#0f172a',
        justifyContent: 'center'
    },

    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#f8fafc',
        textAlign: 'center'
    },

    subtitle: {
        color: '#94a3b8',
        fontSize: 15,
        textAlign: 'center',
        marginTop: 6,
        marginBottom: 24
    },

    card: {
        backgroundColor: '#1e293b',
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: '#334155'
    },

    cardTitle: {
        color: '#f8fafc',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 14
    },

    infoBox: {
        backgroundColor: '#0f172a',
        borderRadius: 14,
        padding: 14,
        marginBottom: 18
    },

    infoText: {
        color: '#e2e8f0',
        fontSize: 15,
        marginBottom: 7
    },

    label: {
        color: '#f8fafc',
        fontWeight: 'bold',
        marginBottom: 8
    },

    input: {
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        borderWidth: 1,
        borderColor: '#334155',
        padding: 14,
        borderRadius: 12,
        fontSize: 16,
        marginBottom: 16
    },

    button: {
        backgroundColor: '#2563eb',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center'
    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    }
});