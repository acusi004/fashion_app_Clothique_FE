import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet } from "react-native";

// Chỉnh sửa địa chỉ
const EditAddress = ({ route }) => {
    
    const { item } = route.params;
    const [name, setName] = useState(item.name);
    const [phone, setPhone] = useState("0123456789");
    const [address, setAddress] = useState("Quận Nam từ niêm, Mỹ Đình 2, Hà Nội");
    const [isDefault, setIsDefault] = useState(item.default);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Chỉnh sửa địa chỉ</Text>
            <Text style={styles.label}>Liên hệ</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
            <TextInput style={styles.input} value={phone} keyboardType="numeric" onChangeText={setPhone} />
            <Text style={styles.label}>Địa chỉ</Text>
            <TextInput style={styles.input} value={address} onChangeText={setAddress} />
            <View style={styles.switchContainer}>
                <Text>Đặt làm mặc định</Text>
                <Switch value={isDefault} onValueChange={setIsDefault} />
            </View>
            <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Lưu</Text>
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

export default EditAddress;