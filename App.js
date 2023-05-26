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

  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();

        if (status !== "granted") {
          alert("Failed to get push token for push notification!");
          return;
        }

        const expoPushToken = (await Notifications.getDevicePushTokenAsync())
          .data;
        console.log("Expo Push Token:", expoPushToken);

        setExpoPushToken(expoPushToken);
      } catch (error) {
        console.log("Error getting push token:", error);
      }
    };

    registerForPushNotificationsAsync();
  }, []);

  return (
    <View style={styles.container}>
      {expoPushToken ? (
        <Text>Your Expo Push Token: {expoPushToken}</Text>
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
