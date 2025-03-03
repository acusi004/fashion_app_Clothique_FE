
import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NavigationContainer,} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import WelcomeScreen from "./src/component/WelcomeScreen.tsx";
import LoginScreen from "./src/component/LoginScreen.tsx";
import HomeScreen from "./src/component/HomeScreen.tsx";
import BottomNavigation from "./src/navigation/BottomNavigation.tsx";
import FavoriteScreen from "./src/component/FavoriteScreen.tsx";
import NotificationScreen from "./src/component/NotificationScreen.tsx";
import ProfileScreen from "./src/component/ProfileScreen.tsx";
import CartScreen from "./src/component/CartScreen.tsx";
import SuccessScreen from "./src/component/SuccessScreen.tsx";



function App() {

  const Stack = createNativeStackNavigator();

  return (
   <NavigationContainer>
      <Stack.Navigator
      initialRouteName="WelcomeScreen"
      >
        <Stack.Screen
            name="WelcomeScreen"
            options={{headerShown:false}}
            component={WelcomeScreen}/>
        <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}/>
        <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}/>
        <Stack.Screen
            name="BottomNavigation"
            options={{headerShown:false}}
            component={BottomNavigation}/>
        <Stack.Screen
            name="FavoriteScreen"
            options={{headerShown:false}}
            component={FavoriteScreen}/>
        <Stack.Screen
            name="NotificationScreen"
            options={{headerShown:false}}
            component={NotificationScreen}/>
        <Stack.Screen
            name="ProfileScreen"
            options={{headerShown:false}}
            component={ProfileScreen}/>
        <Stack.Screen
            name="CartScreen"
            component={CartScreen}
            options={{
               headerTitle:'Giỏ hàng',
               headerTitleAlign:'center'

            }}

        />

        <Stack.Screen
            name="SuccessScreen"
            options={{headerShown:false}}
            component={SuccessScreen}/>

      </Stack.Navigator>
   </NavigationContainer>
  );
}

const styles = StyleSheet.create({

});

export default App;
