//Αρχική οθόνη της εφαρμογής
//Επιλογή για shows και κρατήσεις

import React from 'react'; // Εισάγει React
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'; // Components UI

export default function HomeScreen({ navigation }) { // Παίρνει navigation για αλλαγή οθόνης
    return (
        <View style={styles.container}>

            <Text style={styles.title}>🎬 Theatre Booking</Text>


            <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate('Shows')}
            >
                <Text style={styles.buttonText}>View Shows</Text>
            </TouchableOpacity>


            <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('MyReservations')}
            >
                <Text style={styles.buttonText}>My Reservations</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1, // Πιάνει όλη την οθόνη
        justifyContent: 'center', // Κεντράρει κάθετα
        padding: 20, // Περιθώριο γύρω
        backgroundColor: '#0f172a' // Dark background
    },

    title: {
        fontSize: 28, // Μεγάλος τίτλος
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#f8fafc', // Άσπρο
        marginBottom: 40 // Απόσταση από κουμπιά
    },

    primaryButton: {
        backgroundColor: '#2563eb', // Μπλε
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 15
    },

    secondaryButton: {
        backgroundColor: '#22c55e', // Πράσινο
        padding: 15,
        borderRadius: 12,
        alignItems: 'center'
    },

    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    }

});