import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const index = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function getHistoryFromStorage() {
      try {
        const markersFromStorage = await AsyncStorage.getItem("history");

        if (markersFromStorage) {
          setHistory(JSON.parse(markersFromStorage));
        }
      } catch (error) {
        console.log(error);
      }
    }
    getHistoryFromStorage();
  }, []);

  const renderItems = (i) => {
    let item = JSON.parse(i);

    return (
      <View key={item.id} style={styles.box}>
        <View style={styles.row}>
          <Text style={styles.headings}>Title:</Text>
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.headings}>Body:</Text>
          <Text style={styles.title}>{item.body}</Text>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList data={history} renderItem={({ item }) => renderItems(item)} />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  box: {
    marginHorizontal: 10,
    borderRadius: 6,
    borderColor: "#ccc",
    padding: 10,

    borderWidth: 0.6,
    // height: 100,
    marginVertical: 10,
  },
  headings: {
    fontWeight: "600",
    color: "#000",
    width: 70,
    fontSize: 18,
  },
  title: {
    fontSize: 14,
    color: "grey",
    width: 200,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
