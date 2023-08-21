import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigation();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          setUserData(parsedUserData.data);
          console.log(parsedUserData.data.id)
        }
      } catch (error) {
        console.log("Error retrieving user data:", error);
      }
    };

    getUserData();
  }, []);

  const handleEditPassword = () => {
    // Add your logic for handling password editing here
  
  };

  const handleLogout = async () => {
    try {
      // Call your server endpoint to update the user status to 0
      await fetch("http:192.168.164.188:3003/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData.id, // or any identifier of the logged-in user
        }),
      });

      // Clear user data from AsyncStorage or perform any necessary cleanup
      await AsyncStorage.removeItem("userData");
      // Navigate to the logout screen or the login screen
      navigate.navigate("Login");
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };
  return (
    <View style={styles.container}>
      {userData && (
        <View style={styles.userDataContainer}>
          <Ionicons
            name="ios-image-outline"
            size={120}
            color="black"
            style={styles.icon}
          />
          <View style={styles.dataItem}>
            <Text style={styles.label}>Username:</Text>
            <Text style={styles.value}>{userData.username}</Text>
          </View>
          <View style={styles.dataItem}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{userData.email}</Text>
          </View>
          {/* Display other user data here */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  userDataContainer: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    padding: 16,
  },
  dataItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  label: {
    fontWeight: "bold",
    marginRight: 8,
  },
  value: {
    flex: 1,
  },
  editButton: {
    marginTop: 16,
    backgroundColor: "green",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  editButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: 16,
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Profile;