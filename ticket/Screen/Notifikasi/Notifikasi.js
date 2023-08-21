import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Notifikasi = () => {
  const [users, setUsers] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchUsers();
    getLoggedInUserId();
    fetchMessages();

    const interval = setInterval(() => {
      fetchUsers();
      fetchMessages();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://192.168.164.188:3003/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getLoggedInUserId = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const userId = JSON.parse(userData);
        setLoggedInUserId(userId.data.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch("http://192.168.164.188:3003/pesan");
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserPress = async (userId, username) => {
    if (userId !== loggedInUserId) {
      const unreadMessages = messages.filter(
        (message) => message.id_pengirim === userId && message.status === 1
      );

      if (unreadMessages.length > 0) {
        const updatedMessages = messages.map((message) => {
          if (
            message.id_pengirim === userId &&
            message.status === 1
          ) {
            return { ...message, status: 0 };
          }
          return message;
        });

        setMessages(updatedMessages);
        updateMessageStatus(unreadMessages.map((message) => message.id));
      }

      navigation.navigate("Chat", { userId, loggedInUserId, username });
    }
  };

  const updateMessageStatus = async (messageIds) => {
    try {
      for (const messageId of messageIds) {
        await fetch(`http://192.168.164.188:3003/pesan/${messageId}`, {
          method: "PUT",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderNotificationIcon = (userId) => {
    const unreadMessages = messages.filter(
      (message) => message.id_pengirim === userId && message.status === 1
    );

    if (unreadMessages.length > 0) {
      return (
        <View style={styles.notificationIconContainer}>
          <Text style={styles.notificationIcon}>{unreadMessages.length}</Text>
        </View>
      );
    }

    return null;
  };

  const renderUserIcon = (userId) => {
    const user = users.find((user) => user.id === userId);
    const userStatus = user ? user.status : null;

    if (userStatus === 1) {
      return <FontAwesome name="user" size={24} color="green" />;
    }

    return <FontAwesome name="user" size={24} color="black" />;
  };

  let filteredUsers = [];

  if (loggedInUserId === 17) {
    filteredUsers = users.filter((user) => user.id !== loggedInUserId);
  } else {
    filteredUsers = users.filter((user) => user.id === 17);
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {filteredUsers.map((user) => (
          <TouchableOpacity
            key={user.id}
            onPress={() => handleUserPress(user.id, user.username)}
            style={styles.contactCard}
          >
            {renderUserIcon(user.id)}
            <Text style={styles.contactName}>{user.username}</Text>
            {renderNotificationIcon(user.id)}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    position: "relative",
  },
  contactName: {
    marginLeft: 16,
    fontSize: 16,
  },
  notificationIconContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "red",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationIcon: {
    color: "white",
    fontSize: 12,
  },
});

export default Notifikasi;
