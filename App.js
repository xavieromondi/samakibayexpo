import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import * as Notifications from "expo-notifications";
import { StyleSheet, Text, View } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function PushTokenGenerator() {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [receivedData, setReceivedData] = useState(null); // Add state for received data

  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();

        if (status !== "granted") {
          alert("Failed to get push token for push notification!");
          return;
        }

        const expoPushToken = (await Notifications.getExpoPushTokenAsync())
          .data;
        console.log("Expo Push Token:", expoPushToken);

        setExpoPushToken(expoPushToken);
      } catch (error) {
        console.log("Error getting push token:", error);
      }
    };

    registerForPushNotificationsAsync();

    // Subscribe to incoming notifications
    const subscription =
      Notifications.addNotificationReceivedListener(handleNotification);

    // Unsubscribe from the listener when the component unmounts
    return () => subscription.remove();
  }, []);

  const handleNotification = (notification) => {
    // Extract the data payload from the notification
    const data = notification.request.content.data;

    // Access the specific data fields
    const {
      latitude,
      longitude,
      name,
      phone,
      address,
      orderItems,
      totalPrice,
    } = data;

    // Update the received data state
    setReceivedData({
      latitude: latitude,
      longitude: longitude,
      name: name,
      phone: phone,
      address: address,
      orderItems: orderItems,
      totalPrice: totalPrice,
    });
  };

  return (
    <View style={styles.container}>
      {expoPushToken ? (
        <>
          <Text>Your Expo Push Token: {expoPushToken}</Text>
          {receivedData && (
            <>
              <Text>Latitude: {receivedData.latitude}</Text>
              <Text>Longitude: {receivedData.longitude}</Text>
              <Text>Name: {receivedData.name}</Text>
              <Text>Phone: {receivedData.phone}</Text>
              <Text>Address: {receivedData.address}</Text>
              <Text>Order Items:</Text>
              {receivedData.orderItems.map((item, index) => (
                <View key={index}>
                  <Text>Item: {item.name}</Text>
                  <Text>Price: {item.price}</Text>
                  <Text>Image URL: {item.imageUrl}</Text>
                </View>
              ))}
              <Text>Total Price: {receivedData.totalPrice}</Text>
            </>
          )}
        </>
      ) : (
        <Text>Loading...</Text>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
