import {FlatList, RefreshControl, StyleSheet, Text, ToastAndroid, View} from "react-native";
import {useCallback, useState} from "react";
import {useFocusEffect} from "@react-navigation/native";

import DetailScreen from "./DetailScreen.tsx";
import ItemProducts from "./ItemProducts.tsx";
import {ActivityIndicator} from "react-native-paper";
import {getRandomImage, loadProducts} from "../service/categoryService";



// @ts-ignore
function DressScreen({navigation}) {
    const [dress, setDress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const JeansName = "67d8ede5a0722447f9c322f0";

    useFocusEffect(
        useCallback(() => {
            loadDress()
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadDress()
        setRefreshing(false);
    };


    const loadDress = async () => {
        try {
            const data = await loadProducts(JeansName);
            setDress(data);
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm quan:", error);
        } finally {
            setLoading(false);
        }
    };

    // @ts-ignore
    const handlePressItem = (product) => {
        // @ts-ignore
        navigation.navigate('DetailScreen', {product});

    };

    // @ts-ignore
    const renderItem = ({ item }) => (
        <ItemProducts
            product={item}
            getRandomImage={getRandomImage}
            onPress={handlePressItem}
        />
    );

    return (

        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#000" />
            ) :dress.length > 0 ? (
                <FlatList
                    data={dress}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    numColumns={2}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            ) : (
                <Text style={styles.noData}>Không có sản phẩm nào</Text>
            )}
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
