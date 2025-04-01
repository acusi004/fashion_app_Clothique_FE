import {FlatList, RefreshControl, StyleSheet, Text, ToastAndroid, View} from "react-native";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {ActivityIndicator} from "react-native-paper";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ItemProducts from "./ItemProducts.tsx";
import DetailScreen from "./DetailScreen.tsx";
import {getRandomImage, loadProducts} from "../service/categoryService";


// @ts-ignore
function ShirtScreen({navigation}) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const shirtName = "67d8ec1326b12fdffd63dcfc";

    useFocusEffect(
        useCallback(() => {
            loadShirt()
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadShirt()
        setRefreshing(false);
    };

    const loadShirt = async () => {
        try {
            const data = await loadProducts(shirtName);
            setProducts(data);
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm Áo:", error);
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
            ) : products.length > 0 ? (
                <FlatList
                    data={products}
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
export default ShirtScreen;
