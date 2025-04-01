import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../component/HomeScreen.tsx";
import FavoriteScreen from "../component/FavoriteScreen.tsx";
import NotificationScreen from "../component/NotificationScreen.tsx";
import ProfileScreen from "../component/ProfileScreen.tsx";
import { Image, StyleSheet } from "react-native";
import SearchScreen from "../component/SearchScreen.tsx";

function BottomNavigation() {
    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    const icons: Record<string, any> = {
                        HomeScreen: focused ? require("../Image/home-out.png") : require("../Image/home.png"),
                        FavoriteScreen: focused ? require("../Image/heart-out.png") : require("../Image/heart.png"),
                        NotificationScreen: focused ? require("../Image/bell-ring-out.png") : require("../Image/bell.png"),
                        ProfileScreen: focused ? require("../Image/user-out.png") : require("../Image/user.png"),
                    };
                    return (
                        <Image source={icons[route.name]} style={styles.icon} />
                    );
                },
                tabBarLabel: () => null, // Ẩn nhãn tab
                tabBarStyle: styles.tabBarStyle,
                tabBarHideOnKeyboard: true,
            })}
        >
            <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
            <Tab.Screen name="FavoriteScreen" component={FavoriteScreen} options={{ headerShown: false }} />
            <Tab.Screen name="NotificationScreen" component={NotificationScreen} options={{ headerShown: false }} />
            <Tab.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />

        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBarStyle: {
        borderRadius: 10,
        backgroundColor: "#fff",
        height: 80,
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    icon: {
        width: 22,
        height: 22,
        tintColor: "#000",
    },
});

export default BottomNavigation;
