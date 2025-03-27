import {FlatList, RefreshControl, StyleSheet, Text, ToastAndroid, View} from "react-native";
import {useCallback, useState} from "react";
import {useFocusEffect} from "@react-navigation/native";

import DetailScreen from "./DetailScreen.tsx";
import ItemProducts from "./ItemProducts.tsx";
import {ActivityIndicator} from "react-native-paper";
import {getRandomImage, handlePressItem, loadProducts} from "../service/categoryService";



// @ts-ignore
function TrousersScreen({navigation}) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const JeansName = "67d8ec7aa0722447f9c322cd";

    useFocusEffect(
        useCallback(() => {
            loadJeans()
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadJeans()
        setRefreshing(false);
    };


    const loadJeans = async () => {
        try {
            const data = await loadProducts(JeansName);
            setProducts(data);
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm quan:", error);
        } finally {
            setLoading(false);
        }
    };

    // @ts-ignore


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
export default TrousersScreen;
