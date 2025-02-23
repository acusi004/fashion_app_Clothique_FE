import {StyleSheet, Text, View} from "react-native";

function TopTabNavigation(){
    return(
        <View style={styles.container}>
            <Text style={styles.text}>

            </Text>

        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width:'100%',
        height:50,
        backgroundColor:'#F2EDEB',
        borderRadius:30,
        alignItems:'center',
        justifyContent:'center'

    },
    text:{
        fontWeight:'bold',
    }

})
export default TopTabNavigation;
