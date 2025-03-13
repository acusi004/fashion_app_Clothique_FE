import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet} from "react-native";
import { useNavigation } from "@react-navigation/native";

// Danh sách địa chỉ
const AddressScreen = () => {
    const navigation = useNavigation();
    const [addresses, setAddresses] = useState([
        { id: "1", name: "Đỗ trung Hiếu", address: "Số 55, Ngõ 177, Đường Cầu Diễn, Bắc Từ Liêm, Hà Nội", default: true },
        { id: "2", name: "Đỗ trung Hiếu", address: "Số 55, Ngõ 177, Đường Cầu Diễn, Bắc Từ Liêm, Hà Nội", default: false },
        { id: "3", name: "Đỗ trung Hiếu", address: "Số 55, Ngõ 177, Đường Cầu Diễn, Bắc Từ Liêm, Hà Nội", default: false }
    ]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Địa chỉ</Text>
            <FlatList
                data={addresses}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.addressCard} onPress={() => navigation.navigate("EditAddress", { item })}>
                        <View>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.address}>{item.address}</Text>
                        </View>
                        <Text style={styles.defaultText}>{item.default ? "Mặc định" : ""}</Text>
                    </TouchableOpacity>
                )}
            />
            <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20
    },
    addressCard: {
        backgroundColor: "#f9f9f9",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10
    },
    name: {
        fontSize: 16,
        fontWeight: "bold"
    },
    address: {
        fontSize: 14,
        color: "gray"
    },
    defaultText: {
        fontSize: 12,
        color: "red",
        marginTop: 5
    },
    addButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "black",
        padding: 15,
        borderRadius: 30
    },
    addButtonText: {
        color: "white",
        fontSize: 20
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10
    },
    input: {
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 10,
        padding: 10,
        marginTop: 5
    },
    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10
    },
    saveButton: {
        backgroundColor: "black",
        padding: 15,
        borderRadius: 10,
        alignItems: "center"
    },
    saveButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold"
    },
});

export default AddressScreen;