/*
  Αυτή η οθόνη υλοποιεί το login του χρήστη.
  Ο χρήστης εισάγει email και password, γίνεται request στο backend,
  παίρνει JWT token και το αποθηκεύουμε στη συσκευή .
*/

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import api from '../services/api';
import { saveToken } from '../services/authStorage';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {

        if (!email || !password) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        try {
            const response = await api.post('/auth/login', { email, password });

            await saveToken(response.data.token);

            Alert.alert('Success', 'Login successful');

            navigation.navigate('Home');

        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <View style={styles.container}>

            <Text style={styles.logo}>🎬</Text>

            <Text style={styles.title}>Welcome Back</Text>

            <Text style={styles.subtitle}>Login to your account</Text>

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

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>Don't have an account? Register</Text>
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