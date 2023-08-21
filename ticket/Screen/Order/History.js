import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const io = require("socket.io-client");

const History = () => {
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = useState("");
  const [paymentStatus, setPaymentStatus] = useState({});
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchEmailFromStorage();
    setupSocket();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(email);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [email]);

  const setupSocket = () => {
    const newSocket = io("http://192.168.164.188:3003");
    setSocket(newSocket);

    newSocket.on("connection", () => {
      console.log("Connected to server");
    });

    return () => {
      newSocket.off("connect");
      newSocket.close();
    };
  };

  useEffect(() => {
    if (socket) {
      socket.on("newOrder", (data) => {
        console.log("New order received:", data);
        fetchData(email);
      });
    }
  }, [socket]);
  const fetchData = async (email) => {
    try {
      const response = await axios.get("http://192.168.164.188:3003/pesanan");
      let filteredOrders = response.data
        .filter((order) => order.email === email)
        .slice(-10)
        .reverse(); // Membalik urutan data
  
      setOrders(filteredOrders);
      checkPaymentStatus(filteredOrders);
  
      if (socket) {
        socket.emit("fetchDataSuccess", filteredOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  

  const fetchOrderData = async (order_id) => {
    try {
      const token = "U0ItTWlkLXNlcnZlci1CR1lmQTRTQnFrYmJEcUFneWNCYkJxSUI6R2VudGE0NTY=";
      const response = await axios.get(
        `https://api.sandbox.midtrans.com/v2/${order_id}/status`,
        {
          headers: { Authorization: `Basic ${token}` },
        }
      );
      const orderData = response.data;

      if (orderData.status_code === "201") {
        return "Pembayaran dalam proses";
      } else if (
        orderData.status_code === "200" &&
        orderData.transaction_status === "settlement"
      ) {
        return "Pembayaran berhasil";
      } else {
        return "Pembayaran tidak berhasil";
      }
    } catch (error) {
      return "Pembayaran tidak berhasil";
    }
  };

  const fetchEmailFromStorage = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setEmail(parsedUserData.data.email);
        fetchData(parsedUserData.data.email);
      }
    } catch (error) {
      console.log("Error retrieving email from local storage:", error);
    }
  };

  const checkPaymentStatus = async (orders) => {
    const statusPromises = orders.map((order) =>
      fetchOrderData(order.order_id)
    );
    const paymentStatusList = await Promise.all(statusPromises);

    const updatedStatus = {};
    orders.forEach((order, index) => {
      updatedStatus[order.order_id] = paymentStatusList[index];
    });

    setPaymentStatus(updatedStatus);
  };

  const handlePaymentStatus = (data) => {
    const { order_id, status } = data;
    setPaymentStatus((prevStatus) => ({
      ...prevStatus,
      [order_id]: status,
    }));
  };

  const handleOrderUpdate = (data) => {
    const { order_id } = data;
    fetchData(email);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  const formatPrice = (price) => {
    return price.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      return "";
    }
    return date.toLocaleDateString("id-ID");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {orders.map((order, index) => (
        <View key={`${order.id}-${index}`} style={styles.orderContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Tanggal:</Text>
            <Text style={styles.value}>{formatDate(order.jadwal)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{order.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Nama:</Text>
            <Text style={styles.value}>{order.nama}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Jam:</Text>
            <Text style={styles.value}>{formatTime(order.jam)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Harga:</Text>
            <Text style={styles.value}>{formatPric  e(order.harga)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>No Telp:</Text>
            <Text style={styles.value}>{order.no_telp}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Id pesanan:</Text>
            <Text style={styles.value}>{order.order_id}</Text>
          </View>
          {paymentStatus[order.order_id] && (
            <Text
              style={[
                styles.label,
                styles.paymentStatus,
                paymentStatus[order.order_id] === "Pembayaran berhasil"
                  ? styles.success
                  : styles.error,
              ]}
            >
              {paymentStatus[order.order_id]}
            </Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  orderContainer: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    flex: 1,
    fontWeight: "bold",
  },
  value: {
    flex: 2,
  },
  paymentStatus: {
    marginTop: 8,
    fontWeight: "bold",
  },
  success: {
    color: "green",
  },
  error: {
    color: "red",
  },
});

export default History
