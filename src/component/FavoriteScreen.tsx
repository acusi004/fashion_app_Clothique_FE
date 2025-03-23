import {
    Alert,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View
} from "react-native";
import React, {useEffect, useState} from "react";
import {checkFavorite, getUserFavorites, removeFavorite} from "../service/favoriteService";
import FavoriteItem from "./FavoriteItem.tsx";


function FavoriteScreen() {

    const [favorites, setFavorites] = useState([]);
    const [refreshing, setRefreshing] = useState(false);


    const fetchFavorites = async () => {
        try {
            const response = await getUserFavorites();
            // Giả sử BE trả về { favourites: [...] }
            setFavorites(response.favourites);
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchFavorites()
        setRefreshing(false);
    };
    // Xử lý xóa sản phẩm khỏi danh sách yêu thích
    // @ts-ignore
    const handleRemoveFavorite = async (productId) => {
        try {
            const result = await removeFavorite(productId);
            Alert.alert("Thông báo", result.message);
            // Cập nhật lại danh sách sau khi xóa
            fetchFavorites();
        } catch (error) {
            console.error("Error removing favorite:", error);
        }
    };

    // Xử lý thêm sản phẩm vào giỏ hàng (có thể gọi navigation hoặc dịch vụ giỏ hàng)
    // @ts-ignore
    const handleAddToCart = (item) => {

        // navigation.navigate('Cart', { product: item.productId });
    };

    // @ts-ignore
    const renderItem = ({ item }) => (
        <FavoriteItem
            item={item}
            onAddToCart={() => handleAddToCart(item)}
            onRemove={() => handleRemoveFavorite(item.productId._id)}
        />
    );


    useEffect(() => {
        // Khi màn hình được focus, cập nhật danh sách yêu thích
        fetchFavorites();
    }, []);



    return (
        <View style={styles.screenContainer}>
            <FlatList
                data={favorites}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
            />

        </View>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex:1
    },
    listContainer: {
        padding: 10,
    },


});

export default FavoriteScreen;
