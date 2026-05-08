//Κρατήσεις του συνδεδεμένου χρήστη

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import api from '../services/api';
import { getToken } from '../services/authStorage';

export default function MyReservationsScreen() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReservations();
    }, []);

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

    const fetchReservations = async () => {
        try {
            const token = await getToken();

            const response = await api.get('/reservations/my', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setReservations(response.data);

        } catch (error) {
            Alert.alert('Error', 'Could not fetch reservations');
        } finally {
            setLoading(false);
        }
    };

    const confirmCancel = (reservationId) => {
        Alert.alert(
            'Cancel Reservation',
            'Are you sure you want to cancel this reservation?',
            [
                { text: 'No', style: 'cancel' },
                { text: 'Yes', style: 'destructive', onPress: () => cancelReservation(reservationId) }
            ]
        );
    };

    const cancelReservation = async (reservationId) => {
        try {
            const token = await getToken();

            await api.put(`/reservations/${reservationId}/cancel`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            Alert.alert('Success', 'Reservation cancelled');

            fetchReservations();

        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Cancellation failed');
        }
    };

    const editSeats = async (reservationId) => {
        Alert.prompt(
            'Edit Seats',
            'Enter new number of seats:',
            async (text) => {
                const seats = Number(text);

                if (!seats || seats <= 0) {
                    Alert.alert('Error', 'Invalid number');
                    return;
                }

                try {
                    const token = await getToken();

                    await api.put(
                        `/reservations/${reservationId}/update-seats`,
                        { seat_count: seats },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );

                    Alert.alert('Success', 'Seats updated');
                    fetchReservations();

                } catch (error) {
                    Alert.alert('Error', error.response?.data?.message || 'Update failed');
                }
            }
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.loadingText}>Loading reservations...</Text>
            </View>
        );
    }

    if (reservations.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyIcon}>🎟️</Text>
                <Text style={styles.emptyTitle}>No reservations yet</Text>
                <Text style={styles.emptyText}>Your bookings will appear here.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Reservations</Text>
            <Text style={styles.subtitle}>Manage your theatre bookings</Text>

            <FlatList
                data={reservations}
                keyExtractor={(item) => item.reservation_id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.title}>{item.title}</Text>

                            <Text
                                style={[
                                    styles.statusBadge,
                                    item.status === 'ACTIVE' ? styles.activeBadge : styles.cancelledBadge
                                ]}
                            >
                                {item.status}
                            </Text>
                        </View>

                        <Text style={styles.theatre}>{item.theatre_name}</Text>

                        <View style={styles.infoBox}>
                            <Text style={styles.infoText}>📅 {formatDate(item.show_date)}</Text>
                            <Text style={styles.infoText}>🕒 {formatTime(item.show_time)}</Text>
                            <Text style={styles.infoText}>🎟️ Seats: {item.seat_count}</Text>
                            <Text style={styles.infoText}>💶 Price: €{item.price}</Text>
                        </View>

                        {item.status === 'ACTIVE' && (
                            <>
                                <TouchableOpacity onPress={() => confirmCancel(item.reservation_id)}>
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => editSeats(item.reservation_id)}>
                                    <Text style={{ color: '#38bdf8', marginTop: 8 }}>Edit Seats</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 18,
        backgroundColor: '#0f172a'
    },

    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 18,
        backgroundColor: '#0f172a'
    },

    loadingText: {
        color: '#f8fafc',
        fontSize: 16
    },

    emptyIcon: {
        fontSize: 44,
        marginBottom: 10
    },

    emptyTitle: {
        color: '#f8fafc',
        fontSize: 20,
        fontWeight: 'bold'
    },

    emptyText: {
        color: '#94a3b8',
        marginTop: 6
    },

    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#f8fafc',
        marginTop: 10
    },

    subtitle: {
        color: '#94a3b8',
        fontSize: 15,
        marginBottom: 18,
        marginTop: 4
    },

    card: {
        backgroundColor: '#1e293b',
        padding: 16,
        borderRadius: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#334155'
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6
    },

    title: {
        flex: 1,
        fontSize: 19,
        fontWeight: 'bold',
        color: '#f8fafc',
        marginRight: 10
    },

    theatre: {
        color: '#94a3b8',
        fontSize: 14,
        marginBottom: 12
    },

    statusBadge: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 'bold',
        overflow: 'hidden'
    },

    activeBadge: {
        backgroundColor: '#14532d',
        color: '#86efac'
    },

    cancelledBadge: {
        backgroundColor: '#7f1d1d',
        color: '#fecaca'
    },

    infoBox: {
        backgroundColor: '#0f172a',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12
    },

    infoText: {
        color: '#e2e8f0',
        marginBottom: 5
    },

    cancelButton: {
        backgroundColor: '#dc2626',
        padding: 13,
        borderRadius: 12,
        alignItems: 'center'
    },

    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15
    }
});