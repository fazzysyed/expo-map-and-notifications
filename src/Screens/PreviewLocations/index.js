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

  const handleMarkerPress = (markerId) => {
    setSelectedMarkerId(markerId);
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.title}>Map</Text>
      </View> */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            onPress={() => handleMarkerPress(marker)}
            pinColor={"green"}
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
