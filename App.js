import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RiderMapScreen() {
  const [userLocation, setUserLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [receivedData, setReceivedData] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
    })();

    const subscription = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

    return () => subscription.remove();
  }, []);

  const handleNotificationResponse = (response) => {
    const data = response.notification.request.content.data;

    const {
      latitude,
      longitude,
      name,
      phone,
      address,
      orderItems,
      totalPrice,
      // Add additional data fields as needed
    } = data;

    setReceivedData({
      latitude,
      longitude,
      name,
      phone,
      address,
      orderItems,
      totalPrice,
      // Set additional received data fields
    });

    // Set the destinationLocation state
    setDestinationLocation({
      latitude,
      longitude,
    });
  };

  return (
    <View style={styles.container}>
      {userLocation && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Your Location"
          />

          {destinationLocation && (
            <Marker
              coordinate={{
                latitude: destinationLocation.latitude,
                longitude: destinationLocation.longitude,
              }}
              title="Destination"
            />
          )}
        </MapView>
      )}

      {receivedData && (
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationText}>Name: {receivedData.name}</Text>
          <Text style={styles.notificationText}>
            Phone: {receivedData.phone}
          </Text>
          <Text style={styles.notificationText}>
            Address: {receivedData.address}
          </Text>
          <Text style={styles.notificationText}>Order Items:</Text>
          {receivedData.orderItems.map((item, index) => (
            <View key={index}>
              <Text style={styles.notificationText}>Item: {item.name}</Text>
              <Text style={styles.notificationText}>Price: {item.price}</Text>
            </View>
          ))}
          <Text style={styles.notificationText}>
            Total Price: {receivedData.totalPrice}
          </Text>
          {/* Add additional data fields as needed */}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  notificationContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },
  notificationText: {
    fontSize: 16,
    marginBottom: 5,
  },
});
