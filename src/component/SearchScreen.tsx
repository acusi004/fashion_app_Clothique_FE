import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image, ScrollView,
} from "react-native";
import { getSearchHistory, saveSearchHistory } from "../service/searchHistoryService";
import { searchProducts } from "../service/productService.";
import ItemSearchProducts from "./ItemSearchProducts.tsx";
import AsyncStorage from "@react-native-async-storage/async-storage";

// @ts-ignore
const SearchScreen = ({ navigation }) => {
    const [query, setQuery] = useState("");
    const [history, setHistory] = useState([]);
    const [results, setResults] = useState<{ _id: string }[]>([]);
    const [suggestedResults, setSuggestedResults] = useState<Record<string, { _id: string }[]>>({});

    const handleSearch = async () => {
        if (!query.trim()) return;
        const updated = await saveSearchHistory(query);
        setHistory(updated);
        const data = await searchProducts(query);
        setResults(data);
    };

    const loadSuggestions = async () => {
        const suggestions = {};
        for (let keyword of history) {
            const products = await searchProducts(keyword);
            // @ts-ignore
            suggestions[keyword] = products;
        }
        setSuggestedResults(suggestions);
    };
    const handleClearHistory = async () => {
        try {
            await AsyncStorage.removeItem('searchHistory');
            setHistory([]);
            setSuggestedResults({});
        } catch (err) {
            console.error("Lỗi khi xoá lịch sử:", err);
        }
    };


    useEffect(() => {
        getSearchHistory().then((data) => {
            setHistory(data);
        });
    }, []);

    useEffect(() => {
        if (history.length > 0) {
            loadSuggestions();
        }
    }, [history]);

    // @ts-ignore
    return (

          <View style={{ flex: 1, padding: 12 }}>
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
                              if (text === "") {
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
                             <Image source={require('../Image/cross.png')}/>
                          </TouchableOpacity>
                      )}
                  </View>
              </View>

              {results.length === 0 ? (
                  <>
                      <View style={styles.historyHeader}>
                          <Text style={styles.title}>Lịch sử tìm kiếm:</Text>
                          <TouchableOpacity onPress={handleClearHistory}>
                              <Text style={styles.clearHistory}>Xoá</Text>
                          </TouchableOpacity>
                      </View>

                      {history.map((item, i) => (
                          <TouchableOpacity key={i} onPress={() => setQuery(item)}>
                              <Text style={styles.historyItem}>{item}</Text>
                          </TouchableOpacity>
                      ))}


                      <Text style={[styles.title, { marginTop: 20 }]}>Gợi ý tìm kiếm:</Text>
                      {Object.entries(suggestedResults).map(([keyword, items]) => (
                          <View key={keyword} style={{ marginBottom: 12 }}>
                              <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 6 }}>{keyword}</Text>
                              <FlatList
                                  data={items}
                                  keyExtractor={(item) => item._id}
                                  horizontal
                                  showsHorizontalScrollIndicator={false}
                                  renderItem={({ item }) => (
                                      <ItemSearchProducts
                                          item={item}
                                          onPress={(item: any) =>
                                              navigation.navigate("DetailScreen", { product: item })
                                          }
                                      />
                                  )}
                              />
                          </View>
                      ))}
                  </>
              ) : (
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
                  />
              )}
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
        width: "90%",
    },
    input: {
        flex: 1,
        height: 40,
    },
    clearText: {
        fontSize: 18,
        color: "#999",
        paddingHorizontal: 8,
    },
    title: {
        fontWeight: "bold",
        marginBottom: 5,
        fontSize: 16,
    },
    historyItem: {
        paddingVertical: 6,
        fontSize: 16,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },

    clearHistory: {
        color: 'red',
        fontSize: 14,
    }
});

export default SearchScreen;
