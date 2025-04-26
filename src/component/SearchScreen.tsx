import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { getSearchHistory, saveSearchHistory } from "../service/searchHistoryService";
import { FilterProducts, searchProducts } from '../service/productService.';
import ItemSearchProducts from "./ItemSearchProducts.tsx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FilterDrawer from '../styles/FilterDrawer';

// @ts-ignore
const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [results, setResults] = useState<{ _id: string }[]>([]);
  const [filterVisible, setFilterVisible] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    const updated = await saveSearchHistory(query);
    setHistory(updated);
    const data = await searchProducts(query);
    setResults(data);
  };

  const handleClearHistory = async () => {
    try {
      await AsyncStorage.removeItem('searchHistory');
      setHistory([]);
    } catch (err) {
      console.error("Lỗi khi xoá lịch sử:", err);
    }
  };

  const handleApplyFilters = async (filters) => {
    try {
      const { size, color, minPrice, maxPrice, quantity, categoryId } = filters;
      const data = await FilterProducts(
        query.trim() !== "" ? query : undefined,
        size,
        color,
        minPrice,
        maxPrice,
        quantity,
        categoryId
      );
      setResults(data);
    } catch (err) {
      console.error("Lỗi khi lọc sản phẩm:", err);
    }
  };

  useEffect(() => {
    getSearchHistory().then((data) => {
      setHistory(data);
    });
  }, []);

  return (
    <View style={{ flex: 1, padding: 12 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../Image/back.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <View style={styles.searchInputWrapper}>
          <TextInput
            autoFocus
            placeholder="Tìm kiếm..."
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              if (text.trim() === "") {
                setResults([]);
                getSearchHistory().then(setHistory);
              }
            }}
            onSubmitEditing={handleSearch}
            style={styles.input}
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setQuery("");
                setResults([]);
                getSearchHistory().then(setHistory);
              }}
            >
              <Image source={require('../Image/cross.png')} style={styles.clearIcon} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
        >
          <Image
            source={require("../Image/filter.png")}
            style={styles.filterIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Nội dung tìm kiếm */}
      <ScrollView style={{ flex: 1 }}>
        {/* Kết quả tìm kiếm */}
        {query.trim() !== "" && (
          <>
            <Text style={styles.title}>Kết quả tìm kiếm</Text>
            {results.length > 0 ? (
              <FlatList
                data={results}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <ItemSearchProducts
                    item={item}
                    onPress={(item: { _id: string }) =>
                      navigation.navigate("DetailScreen", { product: item })
                    }
                  />
                )}
                scrollEnabled={false} // Vì đã có ScrollView
              />
            ) : (
              <View style={{ marginTop: 20, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: '#888' }}>Không tìm thấy sản phẩm phù hợp</Text>
              </View>
            )}
          </>
        )}

        {/* Tìm kiếm gần đây */}
        <View style={{ marginTop: 20 }}>
          <View style={styles.historyHeader}>
            <Text style={styles.title}>Tìm kiếm gần đây</Text>
            {history.length > 0 && (
              <TouchableOpacity onPress={handleClearHistory}>
                <Text style={styles.clearHistory}>Xoá lịch sử</Text>
              </TouchableOpacity>
            )}
          </View>

          {history.length > 0 ? (
            history.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => {
                setQuery(item);
                handleSearch();
              }}>
                <Text style={styles.historyItem}>{item}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ fontSize: 16, color: '#888', marginTop: 10 }}>Chưa có lịch sử tìm kiếm</Text>
          )}
        </View>
      </ScrollView>

      {/* Drawer lọc */}
      <FilterDrawer
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={(filters) => {
          setFilterVisible(false);
          handleApplyFilters(filters);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: "#000",
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 8,
    width: "85%",
  },
  input: {
    flex: 1,
    height: 40,
  },
  clearIcon: {
    width: 18,
    height: 18,
    tintColor: "#999",
  },
  filterButton: {
    marginLeft: 1,
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  filterIcon: {
    width: 24,
    height: 24,
    tintColor: "#000",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  historyItem: {
    paddingVertical: 6,
    fontSize: 16,
  },
  clearHistory: {
    color: 'red',
    fontSize: 14,
  },
});

export default SearchScreen;
