
import React from 'react';
import { } from 'react-native';

import { NavigationContainer, } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./src/component/WelcomeScreen.tsx";
import LoginScreen from "./src/component/LoginScreen.tsx";
import RegisterScreen from "./src/component/RegisterScreen.tsx";
import HomeScreen from "./src/component/HomeScreen.tsx";
import BottomNavigation from "./src/navigation/BottomNavigation.tsx";
import FavoriteScreen from "./src/component/FavoriteScreen.tsx";
import NotificationScreen from "./src/component/NotificationScreen.tsx";
import ProfileScreen from "./src/component/ProfileScreen.tsx";
import CartScreen from "./src/component/CartScreen.tsx";
import SuccessScreen from "./src/component/SuccessScreen.tsx";
import ChoseScreen from './src/component/ChoseScreen.tsx';
import AddressScreen from './src/component/AddressScreen.tsx';
import EditProfileScreen from './src/component/EditProfileScreen.tsx';
import CheckOutScreen from './src/component/CheckOutScreen.tsx';
import FeedBackScreen from './src/component/FeedBackScreen.tsx';
import HTScreen from './src/component/HTScreen.tsx';
import DetailScreen from "./src/component/DetailScreen.tsx";
import PaymentScreen from './src/component/PaymentScreen.tsx'
import ChoiceAddress from './src/component/ChoiceAddress.tsx'
import ResetPasswordScreen from "./src/component/ResetPasswordScreen.tsx";
import ChangePassScreen from "./src/component/ChangePassScreen.tsx";
import VerifyOtpScreen from "./src/component/VerifyOtpScreen.tsx";
import SearchScreen from "./src/component/SearchScreen.tsx";
import SettingScreen from "./src/component/SettingScreen.tsx";
import ChatScreen from "./src/component/ChatScreen.tsx";

function App() {

    const Stack = createNativeStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="WelcomeScreen"
            >
                <Stack.Screen
                    name="WelcomeScreen"
                    options={{ headerShown: false ,}}
                    component={WelcomeScreen} />
                    <Stack.Screen
                    name="ChoiceAddress"
                    options={{ headerShown: true }}
                    component={ChoiceAddress} />
                     <Stack.Screen
                    name="PaymentScreen"
                    options={{ headerShown: false }}
                    component={PaymentScreen} />
                <Stack.Screen
                    name="ChoseScreen"
                    options={{ headerShown: false }}
                    component={ChoseScreen} />
                <Stack.Screen
                    name="CheckOutScreen"
                    options={{ headerShown: false }}
                    component={CheckOutScreen} />
                <Stack.Screen
                    name="FeedBackScreen"
                    options={{ headerShown: false }}
                    component={FeedBackScreen} />
                <Stack.Screen
                    name="HTScreen"
                    options={{ headerShown: false }}
                    component={HTScreen} />
                <Stack.Screen
                    name="LoginScreen"
                    options={{ headerShown: false }}
                    component={LoginScreen} />
                <Stack.Screen
                    name="AddressScreen"
                    options={{ title: "Address" }}
                    component={AddressScreen} />
                <Stack.Screen
                    name="EditProfileScreen"
                    options={{ headerShown: false }}
                    component={EditProfileScreen} />
                <Stack.Screen
                    name="RegisterScreen"
                    options={{ headerShown: false }}
                    component={RegisterScreen} />
                <Stack.Screen
                    name="HomeScreen"
                    component={HomeScreen} />
                <Stack.Screen
                    name="BottomNavigation"
                    options={{ headerShown: false }}
                    component={BottomNavigation} />
                <Stack.Screen
                    name="FavoriteScreen"
                    options={{ headerShown: false }}
                    component={FavoriteScreen} />
                <Stack.Screen
                    name="NotificationScreen"
                    options={{ headerShown: false }}
                    component={NotificationScreen} />
                <Stack.Screen
                    name="ProfileScreen"
                    options={{ headerShown: false }}
                    component={ProfileScreen} />
                <Stack.Screen
                    name="DetailScreen"
                    options={{ headerShown: false }}
                    component={DetailScreen} />
                <Stack.Screen
                    name="ResetPasswordScreen"
                    options={{ headerShown: false }}
                    component={ResetPasswordScreen} />
                <Stack.Screen
                    name="ChangePassScreen"
                    component={ChangePassScreen} />
                <Stack.Screen
                    name="VerifyOtpScreen"
                    component={VerifyOtpScreen} />
                <Stack.Screen
                    name="SearchScreen"
                    options={{ headerShown: false }}
                    component={SearchScreen} />
                <Stack.Screen
                    name="SettingScreen"
                    options={{ headerShown: false }}
                    component={SettingScreen} />
                <Stack.Screen
                    name="ChatScreen"
                    options={{ headerShown: false }}
                    component={ChatScreen} />
                <Stack.Screen
                    name="CartScreen"
                    component={CartScreen}
                    options={{
                        headerTitle: 'Giỏ hàng',
                        headerTitleAlign: 'center'

                    }}

                />

                <Stack.Screen
                    name="SuccessScreen"
                    options={{ headerShown: false }}
                    component={SuccessScreen} />

            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
