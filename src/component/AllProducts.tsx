import {Alert, FlatList, RefreshControl, StyleSheet, Text, ToastAndroid, View} from "react-native";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import ItemProducts from "./ItemProducts.tsx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {ActivityIndicator} from "react-native-paper";
import {fetchProducts} from "../service/productService.";



// @ts-ignore
function AllProducts() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    const [error, setError] = useState(null);
    // Tự động gọi lại API khi màn hình được focus
    useFocusEffect(
        useCallback(() => {
            loadProducts()

        }, [])
    );




    // Hỗ trợ pull-to-refresh
    const onRefresh = async () => {
        setRefreshing(true);
        await loadProducts()
        setRefreshing(false);
    };


    const loadProducts = async () => {
        try {
            const data = await fetchProducts();
            if (data) {
                setProducts(data);
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false);
        }
    };


    // Hàm chọn ngẫu nhiên một hình ảnh từ mảng variants
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

    // Hàm xử lý khi click vào item, chuyển sang màn hình chi tiết và truyền data
    // @ts-ignore
    const handlePressItem = (product) => {
        // @ts-ignore
        navigation.navigate('DetailScreen', {product});
    };

    // @ts-ignore
    const renderItem = ({item}) => (
        <ItemProducts
            product={item}
            getRandomImage={getRandomImage}
            onPress={handlePressItem}
        />
    );




    // @ts-ignore
    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#000"/>
            ) : products.length > 0 ? (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    numColumns={2}  // Số cột hiển thị là 2
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
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
export default AllProducts;
