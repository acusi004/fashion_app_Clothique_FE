import {FlatList, RefreshControl, StyleSheet, Text, View} from "react-native";
import AllProducts from "./AllProducts.tsx";


// @ts-ignore
function TrousersScreen({product, getRandomImage, onPress}) {


    return (

      <View>

      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    noData: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16
    }
})
export default TrousersScreen;
