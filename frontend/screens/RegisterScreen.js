//Για τη δημιουργία νέου account

import React, { useState } from 'react'; // Εισάγει React και useState
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native'; // UI components
import api from '../services/api'; // Axios instance για επικοινωνία με backend

export default function RegisterScreen({ navigation }) { // Register screen component
    const [name, setName] = useState(''); // State για το όνομα
    const [email, setEmail] = useState(''); // State για το email
    const [password, setPassword] = useState(''); // State για το password

    const handleRegister = async () => { // Function που εκτελείται όταν πατηθεί Register

        if (!name || !email || !password) { // Έλεγχος για κενά πεδία
            Alert.alert('Error', 'Please fill all fields'); // Εμφανίζει μήνυμα λάθους
            return; // Σταματάει τη function
        }

        if (password.length < 6) { // Έλεγχος μήκους password
            Alert.alert('Error', 'Password must be at least 6 characters'); // Μήνυμα λάθους
            return; // Σταματάει τη function
        }

        if (!email.includes('@')) { // Απλός έλεγχος email format
            Alert.alert('Error', 'Invalid email'); // Μήνυμα λάθους
            return; // Σταματάει τη function
        }

        try {
            await api.post('/auth/register', { name, email, password }); // Στέλνει τα στοιχεία στο backend

            Alert.alert('Success', 'Registration successful'); // Μήνυμα επιτυχίας
            navigation.navigate('Login'); // Μεταφέρει τον χρήστη στο Login

        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Registration failed'); // Εμφανίζει error
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>🎭</Text>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to book theatre tickets</Text>

            <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#0f172a'
    },

    logo: {
        fontSize: 48,
        textAlign: 'center',
        marginBottom: 10
    },

    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#f8fafc',
        textAlign: 'center'
    },

    subtitle: {
        fontSize: 15,
        color: '#94a3b8',
        textAlign: 'center',
        marginBottom: 30,
        marginTop: 6
    },

    input: {
        backgroundColor: '#1e293b',
        color: '#f8fafc',
        borderWidth: 1,
        borderColor: '#334155',
        padding: 14,
        marginBottom: 14,
        borderRadius: 12,
        fontSize: 15
    },

    button: {
        backgroundColor: '#2563eb',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8
    },

    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },

    linkText: {
        color: '#38bdf8',
        textAlign: 'center',
        marginTop: 18,
        fontSize: 14
    }
});