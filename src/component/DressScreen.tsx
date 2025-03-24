import {FlatList, RefreshControl, StyleSheet, Text, View} from "react-native";


// @ts-ignore
function DressScreen({product, getRandomImage, onPress}) {


    return (
        <View style={styles.container}>


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
export default DressScreen;
