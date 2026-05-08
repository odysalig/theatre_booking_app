/*
  Αυτή η οθόνη εμφανίζει τα διαθέσιμα showtimes (ημερομηνίες/ώρες)
  για μια συγκεκριμένη παράσταση.
*/

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import api from '../services/api';

export default function ShowtimesScreen({ route, navigation }) {
    const { showId, title } = route.params;
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchShowtimes();
    }, []);

    const fetchShowtimes = async () => {
        try {
            const response = await api.get(`/shows/${showId}/showtimes`);
            setShowtimes(response.data);
        } catch (error) {
            alert('Failed to load showtimes');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <Text style={styles.loadingText}>Loading showtimes...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <Text style={styles.header}>{title}</Text>
            <Text style={styles.subtitle}>Select date & time</Text>

            <FlatList
                data={showtimes}
                keyExtractor={(item) => item.showtime_id.toString()}
                renderItem={({ item }) => {

                    const formattedDate = new Date(item.show_date).toLocaleDateString();
                    const formattedTime = new Date(`1970-01-01T${item.show_time}`)
                        .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate('Reservation', { showtime: item })}
                        >
                            <Text style={styles.date}>{formattedDate} • {formattedTime}</Text>

                            <Text style={styles.hall}>Hall: {item.hall_name}</Text>

                            <View style={styles.row}>
                                <Text style={styles.price}>€{item.price}</Text>
                                <Text style={styles.seats}>
                                    {item.available_seats} seats left
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
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

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f172a'
    },

    loadingText: {
        color: '#f8fafc'
    },

    header: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#f8fafc'
    },

    subtitle: {
        color: '#94a3b8',
        marginBottom: 18
    },

    card: {
        backgroundColor: '#1e293b',
        padding: 16,
        borderRadius: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#334155'
    },

    date: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#f8fafc',
        marginBottom: 6
    },

    hall: {
        color: '#94a3b8',
        marginBottom: 10
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    price: {
        color: '#22c55e',
        fontWeight: 'bold'
    },

    seats: {
        color: '#38bdf8'
    }

});