
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import HomeScreen from "../component/HomeScreen.tsx";
import FavoriteScreen from "../component/FavoriteScreen.tsx";
import NotificationScreen from "../component/NotificationScreen.tsx";
import ProfileScreen from "../component/ProfileScreen.tsx";
import {Image, StyleSheet} from "react-native";








function BottomNavigation(){

    const Tab = createBottomTabNavigator();

    return(
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({color, size, focused}) => {
                    let iconName;

                    if (route.name === 'HomeScreen') {
                        iconName = focused ? require('../Image/home-out.png') : require('../Image/home.png');
                    } else if (route.name === 'FavoriteScreen') {
                        iconName = focused ? require('../Image/heart-out.png') : require('../Image/heart.png');
                    } else if (route.name === 'NotificationScreen') {
                        iconName = focused ? require('../Image/bell-ring-out.png') : require('../Image/bell.png');
                    } else if (route.name === 'ProfileScreen') {
                        iconName = focused ? require('../Image/user-out.png') : require('../Image/user.png');
                    }

                    return (
                        <Image source={iconName} style={{width:22, height:22, tintColor: '#000'}} />
                    );
                },
                tabBarLabel: ()=> null, // an label
                tabBarStyle: styles.TabBarStyle,




            })}>
            <Tab.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{

                    headerShown:false,
                }}
            />
            <Tab.Screen
                name="FavoriteScreen"
                component={FavoriteScreen}
                options={{ headerShown:false,}}
            />
            <Tab.Screen
                name="NotificationScreen"
                component={NotificationScreen}
                options={{headerShown:false,  }}
            />
            <Tab.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{ headerShown:false, }}
            />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    TabBarStyle: {

        borderRadius:10,
        backgroundColor:'#fff',
        height:80,
        paddingTop:20,
        paddingLeft:20,
        paddingRight:20,

    }

});


export default BottomNavigation;
