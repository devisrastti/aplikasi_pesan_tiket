import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import io from "socket.io-client";

const Payment = () => {
  const route = useRoute();
  const { orderData } = route.params; // Access the order data from the route parameters
  const [redirectUrl, setRedirectUrl] = useState("");
  const navigate = useNavigation();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setupSocket();

    // Clean up socket connection on unmount
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const setupSocket = () => {
    const newSocket = io("http://192.168.164.188:3003");
    setSocket(newSocket);
  };

  useEffect(() => {
    if (socket) {
      // Listen for the "newOrder" event
      socket.on("newOrder", (data) => {
        console.log("New order received:", data);
        // Perform any necessary actions
        handleNewOrder(data);
      });
    }
  }, [socket]);

  const handleNewOrder = (data) => {
    // Handle the new order data received from the server
    console.log("New order received:", data);
    // You can perform any necessary actions here, such as updating the UI or triggering a notification
  };

  const handlePaymentSelection = async (paymentMethod) => {
    try {
      const response = await axios.post(
        "http://192.168.164.188:3003/pesanan",
        orderData
      );
      const { redirectUrl } = response.data;
      console.log("Redirect URL:", redirectUrl);
      setRedirectUrl(redirectUrl);

      // Navigasi ke halaman "Pesanan"
      navigate.navigate("Home");

      // Buka browser eksternal dengan URL redirect
      Linking.openURL(redirectUrl);
    } catch (error) {
      console.error("Error placing order:", error);
      // Handle error
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.selectPaymentText}>Pilih metode pembayaran:</Text>

      <TouchableOpacity
        style={styles.paymentOption}
        onPress={() => handlePaymentSelection("Metode Pembayaran 1")}
      >
        <Text style={styles.paymentOptionText}>Metode Pembayaran</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  selectPaymentText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
  },
  paymentOption: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    fontWeight: "bold",
    color: "white",
    backgroundColor: "green",
  },
  paymentOptionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    alignSelf: "center",
  },
});

export default Payment;
