import {Button, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import BottomNavigation from "../navigation/BottomNavigation.tsx";





// @ts-ignore
function WelcomeScreen({navigation}){





    return(
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Text style={{color:'black'}}>
                Welcome Screen
            </Text>
            <TouchableOpacity style={styles.btnWelcome} onPress={()=> navigation.navigate(BottomNavigation)}>
                    <Text>Go to Home</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    btnWelcome:{
        width:60,
        height:35,
        color:'#33CC00',

    }

});

export default WelcomeScreen;
