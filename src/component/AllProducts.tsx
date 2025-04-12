import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    ToastAndroid,
    View,
} from "react-native";
import {useCallback, useState} from "react";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {ActivityIndicator} from "react-native-paper";
import {fetchProducts} from "../service/productService.";
import ItemProducts from "./ItemProducts.tsx";

const LIMIT = 10;

function AllProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            refreshProducts();
        }, [])
    );

    const refreshProducts = async () => {
        setRefreshing(true);
        try {
            const data = await fetchProducts(1, LIMIT);
            console.log("DATA BACKEND TRẢ VỀ:", data);
            if (data) {
                setProducts(data.products);
                setPage(2);
                setHasMore(data.hasMore);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    };

    const loadMoreProducts = async () => {
        if (!hasMore || loading || refreshing) return;
        setLoading(true);
        try {
            const data = await fetchProducts(page, LIMIT);
            if (data) {
                // ✅ Loại bỏ sản phẩm trùng _id
                const newProducts = data.products.filter(
                    (newItem) => !products.some((existing) => existing._id === newItem._id)
                );
                setProducts((prev) => [...prev, ...newProducts]);
                setPage((prev) => prev + 1);
                setHasMore(data.hasMore);
            }
        } catch (err) {
            console.error("Lỗi khi tải thêm sản phẩm:", err);
        } finally {
            setLoading(false);
        }
    };

    const getRandomImage = (variants) => {
        if (variants && variants.length > 0) {
            const randomVariant = variants[Math.floor(Math.random() * variants.length)];
            return randomVariant.images?.[0] || null;
        }
        return null;
    };

    const handlePressItem = (product) => {
        navigation.navigate("DetailScreen", {product});
    };

    const renderItem = ({item}) => (
        <ItemProducts
            product={item}
            getRandomImage={getRandomImage}
            onPress={handlePressItem}
        />
    );

    return (
        <View style={styles.container}>
            {loading && products.length === 0 ? (
                <ActivityIndicator size="large" color="#000" />
            ) : products.length > 0 ? (
                <FlatList
                    data={products}
                    keyExtractor={(item, index) => `${item._id}_${index}`} // ✅ đảm bảo key là duy nhất
                    renderItem={renderItem}
                    numColumns={2}
                    onEndReached={loadMoreProducts}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={refreshProducts} />
                    }
                    ListFooterComponent={
                        loading && hasMore ? <ActivityIndicator size="small" color="#555" /> : null
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
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
    },
});

export default AllProducts;
