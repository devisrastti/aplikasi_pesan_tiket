import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";
import bg from "../../assets/profile.png";
import cardImage from "../../assets/sepit.jpg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const cardWidth = width * 0.8;

const Home = () => {
  const [username, setUsername] = useState("");
  const navigation = useNavigation();

  const handleCardPress = () => {
    console.log("Card pressed");
    // Add your desired functionality here
  };

  const handleProfile = () => {
    navigation.navigate("Profile");
  };

  const handleTiket = () => {
    navigation.navigate("Tiket");
  };

  const handleJadwal = () => {
    navigation.navigate("Jadwal");
  };

  useEffect(() => {
    const getUsername = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          setUsername(parsedUserData.data.username);
        }
      } catch (error) {
        console.log("Error retrieving username from local storage:", error);
      }
    };

    getUsername();
  }, []);

  const handleImagePress = () => {
    // Kode yang ingin Anda jalankan saat gambar ditekan
   navigation.navigate("Syarat")
    // ... Tambahkan logika atau tindakan lainnya yang Anda inginkan
  };
  

  const checkDataStored = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData !== null) {
        console.log("Data is stored:", JSON.parse(userData));
      } else {
        console.log("Data is not stored.");
      }
    } catch (error) {
      console.log("Error checking stored data:", error);
    }
  };

  useEffect(() => {
    checkDataStored();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Selamat Datang!</Text>
          <View style={styles.headers}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={handleProfile}
            >
              <Image source={bg} style={styles.profileImage} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.usernameContainer}>
          <Text style={styles.username}>{username}</Text>
        </View>
        <View style={styles.concard}>
          <View style={styles.concard1}>
            <View style={styles.cardImage}>
              <TouchableOpacity onPress={handleImagePress}>
                <Image source={cardImage} style={styles.cardImage} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.transportasiContainer}>
          <Text style={styles.transportasiText}>Pilih Menu</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.grid}>
            <TouchableOpacity style={styles.card} onPress={handleTiket}>
              <Ionicons name="boat" size={125} color="green" />
              <Text style={styles.cardText}>Pesan Speedboat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} onPress={handleJadwal}>
              <MaterialIcons name="schedule" size={135} color="green" />
              <Text style={styles.cardText}>Jadwal Speedboat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 65,
    backgroundColor: "#228B22",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  headers: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ccc",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 15,
  },
  usernameContainer: {
    paddingHorizontal: 16,
    paddingBottom: 0,
    backgroundColor: "#228B22",
  },
  username: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  exploreButton: {
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 32,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  profileButton: {
    padding: 8,
    borderRadius: 50,
    width: "100%",
    height: "100%",
  },
  profileImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 10,
    elevation: 10,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: cardWidth * 0.45,
    margin: 10,
    alignItems: "center",
  },
  cardImage: {
    width: 250,
    height: 120,
    resizeMode: "cover",
    marginBottom: 16,
    borderRadius: 20,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  concard: {
    backgroundColor: "#228B22",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 20,
  },
  concard1: {
    paddingBottom: 15,
    marginTop: 20,
  },
  boat: {
    width: 125,
    height: 125,
    resizeMode: "cover",
    marginBottom: 16,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  schedule: {
    width: 125,
    height: 125,
    resizeMode: "cover",
    marginBottom: 16,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginTop: 8,
    marginLeft: 10,
  },
  transportasiContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingLeft: 20,
    backgroundColor: "#fff",
  },
  transportasiText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
});

export default Home;
