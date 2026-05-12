/*
  Αυτή η οθόνη εμφανίζει όλες τις διαθέσιμες παραστάσεις.
*/

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import api from '../services/api';

export default function ShowsScreen({ navigation }) {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchShows();
    }, []);

    const fetchShows = async () => {
        try {
            const response = await api.get('/shows');
            setShows(response.data);
        } catch (error) {
            console.log(error);
            alert('Failed to load shows');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.loadingText}>Loading shows...</Text>
            </View>
        );
    }

    if (shows.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyIcon}>🎭</Text>
                <Text style={styles.emptyText}>No shows available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Available Shows</Text>
            <Text style={styles.subtitle}>Choose a theatre performance</Text>

            <FlatList
                data={shows}
                keyExtractor={(item) => item.show_id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() =>
                            navigation.navigate('Showtimes', {
                                showId: item.show_id,
                                title: item.title
                            })
                        }
                    >
                        <View style={styles.cardTop}>
                            <Text style={styles.icon}>🎬</Text>
                            <View style={styles.cardTextArea}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.theatre}>{item.theatre_name}</Text>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoBadge}>{item.duration} min</Text>
                            <Text style={styles.infoBadge}>{item.age_rating || 'All ages'}</Text>
                        </View>

                        <Text style={styles.tapText}>Tap to view showtimes →</Text>
                    </TouchableOpacity>
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
        padding: 16,
        backgroundColor: '#0f172a'
    },

    loadingText: {
        color: '#f8fafc',
        fontSize: 16
    },

    emptyIcon: {
        fontSize: 42,
        marginBottom: 10
    },

    emptyText: {
        color: '#f8fafc',
        fontSize: 17,
        fontWeight: 'bold'
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
        marginBottom: 20,
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

    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },

    icon: {
        fontSize: 32,
        marginRight: 12
    },

    cardTextArea: {
        flex: 1
    },

    title: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#f8fafc',
        marginBottom: 4
    },

    theatre: {
        color: '#94a3b8',
        fontSize: 14
    },

    infoRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12
    },

    infoBadge: {
        backgroundColor: '#334155',
        color: '#e2e8f0',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 20,
        fontSize: 13
    },

    tapText: {
        color: '#38bdf8',
        fontWeight: '600',
        marginTop: 4
    }
});