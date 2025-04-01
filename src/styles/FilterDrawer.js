// FilterDrawer.js
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    ScrollView
} from "react-native";
import { Picker } from "@react-native-picker/picker";

// Mảng size ví dụ
const SIZE_OPTIONS = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

// Mảng màu ví dụ (bạn có thể thêm/bớt tuỳ ý)
const COLOR_OPTIONS = [
    "#FF0000", // Đỏ
    "#0000FF", // Xanh dương
    "#008000", // Xanh lá
    "#000000", // Đen
    "#FFFFFF", // Trắng
    "#808080", // Xám
    "#FFFF00", // Vàng
    "#FFA500", // Cam
    "#FFC0CB", // Hồng
    "#800080"  // Tím
];

const FilterDrawer = ({ visible, onClose, onApply }) => {
    const [selectedSize, setSelectedSize] = useState(SIZE_OPTIONS[0]);
    const [selectedColor, setSelectedColor] = useState(null);
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");

    // Hàm reset filter
    const handleReset = () => {
        setSelectedSize(SIZE_OPTIONS[0]);
        setSelectedColor(null);
        setPrice("");
        setQuantity("");
    };

    // Hàm xác nhận (Apply)
    const handleApply = () => {
        onApply({
            size: selectedSize,
            color: selectedColor,
            price,
            quantity
        });
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            {/* Overlay (nền mờ) */}
            <View style={styles.overlay}>
                {/* Khu vực chạm để đóng Drawer */}
                <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} />

                {/* Container Drawer */}
                <View style={styles.drawerContainer}>
                    <Text style={styles.drawerTitle}>Lọc Sản Phẩm</Text>

                    <ScrollView>
                        {/* Size */}
                        <Text style={styles.label}>Size</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedSize}
                                onValueChange={(value) => setSelectedSize(value)}
                            >
                                {SIZE_OPTIONS.map((sz) => (
                                    <Picker.Item key={sz} label={sz} value={sz} />
                                ))}
                            </Picker>
                        </View>

                        {/* Màu */}
                        <Text style={styles.label}>Màu</Text>
                        <View style={styles.colorContainer}>
                            {COLOR_OPTIONS.map((c) => {
                                const isSelected = c === selectedColor;
                                return (
                                    <TouchableOpacity
                                        key={c}
                                        style={[
                                            styles.colorCircle,
                                            { backgroundColor: c },
                                            isSelected && styles.colorSelected
                                        ]}
                                        onPress={() => setSelectedColor(c)}
                                    />
                                );
                            })}
                        </View>

                        {/* Giá */}
                        <Text style={styles.label}>Giá</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập giá"
                            keyboardType="numeric"
                            value={price}
                            onChangeText={setPrice}
                        />

                        {/* Số lượng */}
                        <Text style={styles.label}>Số lượng</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập số lượng"
                            keyboardType="numeric"
                            value={quantity}
                            onChangeText={setQuantity}
                        />

                        {/* Nút hành động */}
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                                <Text style={styles.resetButtonText}>Xoá bộ lọc</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                                <Text style={styles.applyButtonText}>Áp dụng</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export const stylesChange = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 20,
    },
    title: {
        textAlign: "left",
        fontSize: 40,
        fontWeight: "bold",
        marginBottom: 200,
    },
    input: {
        backgroundColor: "#FFFBFB",
        width: "100%",
        height: 50,
        borderColor: "#000",
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    inputContainer: {
        backgroundColor: "#FFFBFB",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: 50,
        borderColor: "#000",
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#000",
        paddingVertical: 15,
        width: "100%",
        alignItems: "center",
        borderRadius: 25,
        marginTop: 70,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    inputWrapper: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#000",
        marginBottom: 40,
    },
    eyeImage: {
        width: 24,
        height: 24,
    },
    eyeIcon: {
        padding: 10,
    },
    inputPassword: {
        flex: 1,
    },
    footerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 15,
    },
    footerText: {
        color: "#000",
        fontSize: 14,
        fontWeight: "bold"
    },

});

export default FilterDrawer;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        flexDirection: "row"
    },
    overlayTouchable: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)" // màu mờ nền
    },
    drawerContainer: {
        width: 300, // chiều rộng Drawer
        backgroundColor: "#fff",
        padding: 16,
        justifyContent: "flex-start"
    },
    drawerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10
    },
    label: {
        fontSize: 14,
        marginTop: 12,
        marginBottom: 4,
        fontWeight: "500"
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6
    },
    colorContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginVertical: 8
    },
    colorCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#ccc"
    },
    colorSelected: {
        borderWidth: 2,
        borderColor: "#000"
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 6,
        fontSize: 14
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 16
    },
    resetButton: {
        backgroundColor: "#999",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 6
    },
    resetButtonText: {
        color: "#fff",
        fontWeight: "bold"
    },
    applyButton: {
        backgroundColor: "#27ae60",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 6
    },
    applyButtonText: {
        color: "#fff",
        fontWeight: "bold"
    }
});
