//Βασικό αρχείο του frontend

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ShowScreen from './screens/ShowScreen';
import ShowtimesScreen from './screens/ShowtimesScreen';
import ReservationScreen from './screens/ReservationScreen';
import MyReservationsScreen from './screens/MyReservationsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Shows" component={ShowScreen} />
                <Stack.Screen name="Showtimes" component={ShowtimesScreen} />
                <Stack.Screen name="Reservation" component={ReservationScreen} />
                <Stack.Screen name="MyReservations" component={MyReservationsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}