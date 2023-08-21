import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, Entypo, AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

import Home from "../Home/Home";
import Notifikasi from "../Notifikasi/Notifikasi";
import History from "../Order/History";

const Tab = createBottomTabNavigator();

const BottomNav = () => {
  const [notificationCount, setNotificationCount] = useState(0); // State for notification count

  useEffect(() => {
    fetchNotificationCount();
  }, []);

  const fetchNotificationCount = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData"); // Get user data from AsyncStorage
      const userData = JSON.parse(storedUserData);
      const userEmail = userData.data.email;

      const response = await fetch("http://192.168.164.188:3003/pesanan");
      const data = await response.json();

      const count = data.reduce((total, order) => {
        if (order.status === "1" && order.email === userEmail) {
          return total + 1;
        } else {
          return total;
        }
      }, 0);

      setNotificationCount(count);
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  };

  useEffect(() => {
    // Fetch notification count initially
    fetchNotificationCount();

    // Refresh notification count every 1 second
    const interval = setInterval(fetchNotificationCount, 1000);

    // Cleanup the interval on component unmount
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleDeleteNotifications = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData"); // Get user data from AsyncStorage
      const userData = JSON.parse(storedUserData);
      const userEmail = userData.data.email;
      console.log(userEmail);

      const response = await fetch("http://192.168.164.188:3003/del-notif", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userEmail,
        }),
      });

      if (response.ok) {
      } else {
        console.error("Error deleting notifications");
      }
    } catch (error) {
      console.error("Error deleting notifications:", error);
    }
  };

  return (
    <Tab.Navigator
    
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconComponent;

          if (route.name === "Home") {
            iconComponent = (
              <Ionicons
                name="boat-outline"
                size={size}
                color={focused ? "green" : color}
              />
            );
          } else if (route.name === "Pesanan") {
            iconComponent = (
              <View style={styles.iconContainer}>
                <Entypo
                  name="text-document"
                  size={size}
                  color={focused ? "green" : color}
                />
                {notificationCount > 0 && (
                  <Text style={styles.badge}>{notificationCount}</Text>
                )}
              </View>
            );
          } else if (route.name === "Notifikasi") {
            iconComponent = (
              <AntDesign
                name="customerservice"
                size={24}
                color={focused ? "green" : color}
              />
            );
          }

          return iconComponent;
        },
        activeTintColor: "green",
        tabBarActiveTintColor: "green",
        tabBarStyle: { display: "flex" },
        
        
        headerStyle: {
          backgroundColor: "green", // Change the color of the area above the header
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          title: "Tiket",
          headerStyle: {
            backgroundColor: "green",
          },
          headerTintColor: "white",
        }}
      />
      <Tab.Screen
        name="Pesanan"
        component={History}
        options={{
          headerShown: true,
          title: "Pesanan",
          headerStyle: {
            backgroundColor: "green",
          },
          headerTintColor: "white",
        }}
        listeners={({ navigation }) => ({
          focus: () => handleDeleteNotifications(),
        })}
      />
      <Tab.Screen
        name="Notifikasi"
        component={Notifikasi}
        options={{
          headerShown: true,
          title: "Bantuan",
          headerStyle: {
            backgroundColor: "green",
          },
          headerTintColor: "white",
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "red",
    color: "white",
    fontSize: 12,
    textAlign: "center",
    overflow: "hidden",
  },
});

export default BottomNav;
