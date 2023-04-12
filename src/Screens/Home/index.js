import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, Polyline } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MapScreen() {
  const navigation = useNavigation();
  const [markers, setMarkers] = useState([]);
  const [secondMarker, setSecondMarker] = useState(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

  useEffect(() => {
    async function getMarkersFromStorage() {
      try {
        const markersFromStorage = await AsyncStorage.getItem("markers");
        if (markersFromStorage) {
          setMarkers(JSON.parse(markersFromStorage));
        }
      } catch (error) {
        console.log(error);
      }
    }
    getMarkersFromStorage();
  }, []);

  useEffect(() => {
    async function saveMarkersToStorage() {
      try {
        await AsyncStorage.setItem("markers", JSON.stringify(markers));
      } catch (error) {
        console.log(error);
      }
    }
    saveMarkersToStorage();
  }, [markers]);

  const handleMapPress = (event) => {
    if (secondMarker) {
      // If the user has already added a second marker, create a range of markers
      const start = secondMarker.coordinate;
      const end = event.nativeEvent.coordinate;
      const range = [];

      for (let i = 0; i < 10; i++) {
        const fraction = i / 10;
        const lat = start.latitude + fraction * (end.latitude - start.latitude);
        const lng =
          start.longitude + fraction * (end.longitude - start.longitude);
        range.push({
          coordinate: { latitude: lat, longitude: lng },
          id: markers.length + i,
        });
      }

      setMarkers([...markers, ...range]);
      setSecondMarker(null);
    } else if (markers.length === 0) {
      // If no markers have been added yet, add the first marker
      const newMarker = {
        coordinate: event.nativeEvent.coordinate,
        id: 0,
      };
      setMarkers([...markers, newMarker]);
    } else {
      // If one marker has already been added, add the second marker
      const newMarker = {
        coordinate: event.nativeEvent.coordinate,
        id: markers.length,
      };
      setMarkers([...markers, newMarker]);
    }
  };

  const handleNextPress = () => {
    navigation.navigate("Select Disaster", {
      marker: selectedMarkerId,
    });
  };

  const handleMarkerPress = (markerId) => {
    setSelectedMarkerId(markerId);
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.title}>Map</Text>
      </View> */}
      <TouchableOpacity
        title="Next"
        style={styles.button}
        onPress={() => {
          navigation.navigate("History");
        }}
      >
        <Text style={styles.next}>History</Text>
      </TouchableOpacity>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            onPress={() => handleMarkerPress(marker)}
            pinColor={"red"}
            title={"Selected Pin"}
          />
        ))}
        {secondMarker && (
          <Polyline
            coordinates={[
              markers[markers.length - 1].coordinate,
              secondMarker.coordinate,
            ]}
            strokeColor="blue"
            strokeWidth={2}
          />
        )}
      </MapView>
      {markers.length >= 1 && (
        <TouchableOpacity
          title="Next"
          style={styles.button}
          onPress={handleNextPress}
        >
          <Text style={styles.next}>Next</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
    justifyContent: "space-between",
  },
  header: {
    height: 50,
    backgroundColor: "#F5FCFF",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  button: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00bfff",
  },
  next: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },

  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
  map: {
    flex: 1,
    width: "100%",
  },
});
