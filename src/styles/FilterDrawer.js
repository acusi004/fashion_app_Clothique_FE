import React, { useState, useEffect } from "react";
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
import {fetchCategories} from '../service/productService.';


const SIZE_OPTIONS = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

const COLOR_OPTIONS = [
  "#FF0000", "#0000FF", "#008000", "#000000",
  "#FFFFFF", "#808080", "#FFFF00", "#FFA500",
  "#FFC0CB", "#800080"
];

const FilterDrawer = ({ visible, onClose, onApply }) => {
  const [selectedSize, setSelectedSize] = useState(SIZE_OPTIONS[0]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [quantity, setQuantity] = useState("");
  const [categories, setCategories] = useState([]); // 🆕 Thêm state lưu danh sách Category
  const [selectedCategory, setSelectedCategory] = useState(""); // 🆕 Thêm state lưu Category chọn

  useEffect(() => {
    if (visible) {
      fetchCategories()
        .then(setCategories)
        .catch((err) => console.error("Lỗi lấy danh sách Category:", err));
    }
  }, [visible]);


  const handleReset = () => {
    setSelectedSize(SIZE_OPTIONS[0]);
    setSelectedColor(null);
    setPrice("");
    setQuantity("");
    setSelectedCategory(""); // 🆕 Reset Category
  };

  const handleApply = () => {
    onApply({
      size: selectedSize,
      color: selectedColor,
      minPrice,
      maxPrice,
      quantity,
      categoryId: selectedCategory,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} />

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

            {/* Category 🆕 */}
            <Text style={styles.label}>Danh mục</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value)}
              >
                <Picker.Item label="Tất cả" value="" />
                {categories.map((cat) => (
                  <Picker.Item key={cat._id} label={cat.name} value={cat._id} />
                ))}
              </Picker>
            </View>

            {/* Giá tối thiểu */}
            <Text style={styles.label}>Giá tối thiểu</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập giá tối thiểu"
              keyboardType="numeric"
              value={minPrice}
              onChangeText={setMinPrice}
            />

            {/* Giá tối đa */}
            <Text style={styles.label}>Giá tối đa</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập giá tối đa"
              keyboardType="numeric"
              value={maxPrice}
              onChangeText={setMaxPrice}
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

export default FilterDrawer;
