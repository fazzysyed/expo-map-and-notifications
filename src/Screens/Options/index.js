import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";

import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SelectDisasterScreen() {
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    { id: 1, name: "Fire" },
    { id: 2, name: "Ice" },
    { id: 3, name: "Flood" },
  ];

  const handleOptionPress = (optionId) => {
    setSelectedOption(optionId);
  };

  const renderOption = ({ item }) => {
    return (
      <TouchableOpacity
        style={[
          styles.option,
          selectedOption === item.id && styles.selectedOption,
        ]}
        onPress={() => handleOptionPress(item.id)}
      >
        <Text style={styles.optionName}>{item.name}</Text>
        {selectedOption === item.id && (
          <Text style={styles.selectedIcon}>✓</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={options}
        renderItem={renderOption}
        keyExtractor={(item) => item.id.toString()}
      />

      {selectedOption && (
        <TouchableOpacity
          onPress={async () => {
            let newArray = options.filter((e) => e.id === selectedOption);

            await Notifications.scheduleNotificationAsync({
              content: {
                title: newArray[0].name,
                body: "Emergency! Please call for help immediately!",
                data: { data: "goes here" },
              },
              trigger: null,
            }).then(async () => {
              try {
                const objectString = JSON.stringify({
                  title: newArray[0].name,
                  body: "Emergency! Please call for help immediately!",
                });
                const existingArrayString = await AsyncStorage.getItem(
                  "history"
                );
                const existingArray = existingArrayString
                  ? JSON.parse(existingArrayString)
                  : [];
                existingArray.push(objectString);
                const updatedArrayString = JSON.stringify(existingArray);
                await AsyncStorage.setItem("history", updatedArrayString);
              } catch (error) {
                console.error(error);
              }
            });
          }}
          title="Next"
          style={styles.button}
        >
          <Text style={styles.send}>Send Alert</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  selectedOption: {
    backgroundColor: "#eee",
  },
  optionName: {
    fontSize: 18,
  },
  button: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00bfff",
    marginBottom: 60,
  },
  send: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  selectedIcon: {
    fontSize: 20,
    color: "green",
  },
});
