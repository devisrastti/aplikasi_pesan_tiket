import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";

const Jadwal = () => {
  const [dataJadwal, setDataJadwal] = useState([]);
  const [isFadeInCompleted, setIsFadeInCompleted] = useState(false);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    return () => {
      clearInterval(interval); // Clean up the interval when the component unmounts
    };
  }, []);

  useEffect(() => {
    if (!isFadeInCompleted) {
      fadeIn();
    }
  }, [dataJadwal]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://192.168.164.188:3003/jadwal");
      const currentDate = new Date();
      const filteredData = response.data.filter((jadwal) => {
        const jadwalDate = new Date(jadwal.hari);
        return jadwalDate >= currentDate;
      });
      setDataJadwal(filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    return `${day} ${month} ${year}`;
  };

  const formatTime = (timeString) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString(
      undefined,
      options
    );
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 5,
      duration: 5000,
      useNativeDriver: true,
    }).start(() => {
      setIsFadeInCompleted(true);
    });
  };

  const renderMonthTables = () => {
    const groupedData = groupDataByMonth(dataJadwal);
    return Object.entries(groupedData).map(([month, monthData]) => (
      <Animated.ScrollView
        key={month}
        style={[styles.monthContainer, { opacity: fadeAnim }]}
      >
        <Text style={styles.monthText}>{month}</Text>
        {monthData.map((jadwal, index) => (
          <ScrollView key={index} style={styles.cardContainer}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Kota Asal:</Text>
              <Text style={styles.cardText}>{jadwal.kota_asal}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Kota Tujuan:</Text>
              <Text style={styles.cardText}>{jadwal.kota_tujuan}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Tanggal:</Text>
              <Text style={styles.cardText}>{formatDate(jadwal.hari)}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Jam:</Text>
              <Text style={styles.cardText}>{formatTime(jadwal.jam)}</Text>
            </View>
          </ScrollView>
        ))}
      </Animated.ScrollView>
    ));
  };

  const groupDataByMonth = (data) => {
    const groupedData = {};
    data.forEach((jadwal) => {
      const month = new Date(jadwal.hari).toLocaleString("default", {
        month: "long",
        year: "numeric", // Include the year in the grouping
      });
      if (!groupedData[month]) {
        groupedData[month] = [];
      }
      groupedData[month].push(jadwal);
    });
    return groupedData;
  };

  return <View style={styles.container}>{renderMonthTables()}</View>;
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#F2F2F2",
    flex: 1,
  },
  monthContainer: {
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "center",
  },
  cardContainer: {
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  card: {
    marginBottom: 5,
  },
  cardLabel: {
    fontSize: 12,
    color: "#888888",
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
});

export default Jadwal;