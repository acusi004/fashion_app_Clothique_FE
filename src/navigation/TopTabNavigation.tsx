import { StyleSheet, Text, View } from "react-native";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import ShirtScreen from "../component/ShirtScreen.tsx";
import TrousersScreen from "../component/TrousersScreen.tsx";
import DressScreen from "../component/DressScreen.tsx";
import AllProducts from "../component/AllProducts.tsx";

function TopTabNavigation() {

    const Tab = createMaterialTopTabNavigator();

    return (
       <Tab.Navigator
           screenOptions={{

               tabBarStyle: {
                   backgroundColor: '#F6F6F6' ,
                   borderRadius:25,
                   elevation: 0,
               },
               tabBarIndicatorStyle: { backgroundColor: '#000' },
               tabBarBounces:true
           }}
       >
           <Tab.Screen
               name="Tất cả"
               component={AllProducts}

           />

           <Tab.Screen
               name="Áo"
               component={ShirtScreen}

         />
           <Tab.Screen
               name="Quần"
               component={TrousersScreen}/>
           <Tab.Screen
               name="Váy"
               component={DressScreen}/>
       </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "#000",
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#000",
    },
});

export default TopTabNavigation;
