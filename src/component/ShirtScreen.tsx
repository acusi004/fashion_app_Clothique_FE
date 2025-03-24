import {FlatList, RefreshControl, StyleSheet, Text, ToastAndroid, View} from "react-native";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {ActivityIndicator} from "react-native-paper";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ItemProducts from "./ItemProducts.tsx";
import DetailScreen from "./DetailScreen.tsx";


// @ts-ignore
function ShirtScreen({navigation}) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const shirtName = "67d8ec1326b12fdffd63dcfc";

    useFocusEffect(
        useCallback(() => {
            loadProducts();

        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadProducts();
        setRefreshing(false);
    };

    // Hàm lấy token từ AsyncStorage
    const getToken = async () => {
        try {
            return await AsyncStorage.getItem('accessToken');
        } catch (error) {
            console.error('Lỗi khi lấy token:', error);
            return null;
        }
    };

    const loadProducts = async () => {

        const token = await getToken();
        try {
            const response = await axios.get(`http://10.0.2.2:5000/v1/product/search?categoryId=${shirtName}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            ToastAndroid.show(`Data: ${products }`, ToastAndroid.SHORT);
            setProducts(response.data);
        } catch (err) {
            console.error("Lỗi khi lấy sản phẩm Áo:", err);

        } finally {
            setLoading(false);
        }
    };
    // @ts-ignore
    const getRandomImage = (variants) => {
        if (variants && variants.length > 0) {
            const randomVariant = variants[Math.floor(Math.random() * variants.length)];
            return randomVariant.images && randomVariant.images.length > 0
                ? randomVariant.images[0]
                : null;
        }
        return null;
    };

    // @ts-ignore
    const handlePressItem = (product) => {
        navigation.navigate(DetailScreen, { product });
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
            {/*{loading ? (*/}
            {/*    <ActivityIndicator size="large" color="#000" />*/}
            {/*) : products.length > 0 ? (*/}
            {/*    <FlatList*/}
            {/*        data={products}*/}
            {/*        keyExtractor={(item) => item._id}*/}
            {/*        renderItem={renderItem}*/}
            {/*        numColumns={2}*/}
            {/*        refreshControl={*/}
            {/*            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />*/}
            {/*        }*/}
            {/*    />*/}
            {/*) : (*/}
            {/*    <Text style={styles.noData}>Không có sản phẩm nào</Text>*/}
            {/*)}*/}
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
