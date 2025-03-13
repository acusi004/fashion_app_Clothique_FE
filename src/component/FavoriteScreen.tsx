import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

function FavoriteScreen() {

    return (
        <TouchableOpacity style={styles.container}>
            <View style={styles.btnItem}>
                <Image style={styles.FvImage} source={require('../Image/QuanAo.png')} />
            </View>
            <View style={{ flexDirection: 'column' }}>
                <Text style={styles.FvTitle}>Bộ quần áo hình tam giác</Text>
                <Text style={styles.FvPrice}>200.000 VND</Text>
            </View>
            <View style={{ flexDirection: 'column', }}>
                <TouchableOpacity style={styles.btnAddToCart}>
                    <Image style={styles.btnIconBag} source={require('../Image/shopping-bag.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnDelete}>
                    <Image style={styles.btnIconBag} source={require('../Image/remove.png')} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1,
        padding: 20,
        justifyContent: 'space-around'


    }, btnItem: {


    },
    FvImage: {

    },
    FvTitle: {
        fontFamily: 'Nunito Sans',
        fontSize: 14,
        color: '#606060',


    },
    FvPrice: {
        fontWeight: 'bold',
        marginTop: 5
    },
    btnAddToCart: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnIconBag: {
        width: 18,
        height: 18,
    },
    btnDelete: {
        width: 34,
        height: 34,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    }


});

export default FavoriteScreen;
