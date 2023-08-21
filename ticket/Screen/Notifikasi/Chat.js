import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";


const MAX_MESSAGE_LENGTH = 1000;

const Chat = ({ route }) => {
  const { userId, loggedInUserId, username } = route.params;
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [expandedMessageIds, setExpandedMessageIds] = useState([]);

  useEffect(() => {
    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch("http://192.168.164.188:3003/pesan");
      const data = await response.json();

      const filteredMessages = data.filter(
        (message) =>
          (message.id_pengirim === loggedInUserId &&
            message.id_penerima === userId) ||
          (message.id_pengirim === userId &&
            message.id_penerima === loggedInUserId)
      );

      setMessages(filteredMessages);
      getLoggedInUsername();
    } catch (error) {
      console.error(error);
    }
  };

  const getLoggedInUsername = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const user = JSON.parse(userData);
        setLoggedInUsername(user.data.username);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() === "") {
      return; // Do nothing if message is empty
    }

    try {
      setIsSending(true);
      const response = await fetch("http://192.168.164.188:3003/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_pengirim: loggedInUserId,
          id_penerima: userId,
          pesan: message,
          nama_pengirim: loggedInUsername,
          nama_penerima: username,
          status: "1",
        }),
      });
      if (!response.ok) {
        throw new Error("Server response was not OK");
      }
      setMessage("");
      fetchMessages(); // Fetch messages immediately after sending
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const handleExpandMessage = (messageId) => {
    setExpandedMessageIds((prevState) => [...prevState, messageId]);
  };

  const renderItem = ({ item }) => {
    const isSender = item.id_pengirim === loggedInUserId;
    const containerStyle = isSender
      ? styles.sentMessage
      : styles.receivedMessage;
    const senderNameStyle = isSender
      ? styles.sentSenderName
      : styles.receivedSenderName;
    const senderName = isSender ? "Anda" : item.nama_pengirim;
    const receiverName = isSender ? item.nama_penerima : loggedInUsername;

    const isMessageTruncated = item.pesan.length > MAX_MESSAGE_LENGTH;
    const isExpanded = expandedMessageIds.includes(item.id);

    const truncatedMessage = item.pesan.slice(0, MAX_MESSAGE_LENGTH);

    // Mengonversi waktu pesan ke objek Date
    const messageTime = new Date(item.time);
    // Format waktu menjadi string yang diinginkan (misalnya: "HH:mm")
    const formattedTime = messageTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });

    return (
      <View style={[styles.messageContainer, containerStyle]}>
        <Text style={[styles.senderName, senderNameStyle]}>{senderName}</Text>
        <Text>
          {isExpanded ? item.pesan : truncatedMessage}
          {isMessageTruncated && !isExpanded && (
            <Text
              style={styles.showMoreText}
              onPress={() => handleExpandMessage(item.id)}
            >
              Tampilkan selengkapnya...
            </Text>
          )}
        </Text>
        <View style={styles.timeContainer}>
          <Text style={styles.messageTime}>{formattedTime}</Text>
        </View>
      </View>
    );
  };

  const keyExtractor = (item, index) => index.toString();

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 0) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  const handleScrollToBottom = () => {
    flatListRef.current.scrollToIndex({ animated: true, index: 0 });
  };

  const renderScrollButton = () => {
    if (!showScrollButton) {
      return null;
    }
    return (
      <TouchableOpacity
        style={styles.scrollButton}
        onPress={handleScrollToBottom}
      >
        <MaterialIcons name="keyboard-arrow-down" size={30} color="black" />
      </TouchableOpacity>
    );
  };

  const flatListRef = useRef();

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={messages.slice().reverse()}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        inverted={true}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      />
      {renderScrollButton()}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { opacity: isSending || message.trim() === "" ? 0.5 : 1 },
          ]}
          onPress={handleSendMessage}
          disabled={isSending || message.trim() === ""}
        >
          <MaterialIcons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 8,
    padding: 5,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    borderWidth: 2,
    borderColor: "#ccc",
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#dcf8c6",
    borderColor: "#8fd684",
  },
  receivedMessage: {
    alignSelf: "flex-start",
  },
  senderName: {  
    fontWeight: "bold",
    marginBottom: 4,
  },
  sentSenderName: {
    color: "#555",
  },
  receivedSenderName: {
    color: "#222",
  },
  timeContainer: {
    alignItems: "flex-end",
    marginTop: 4,
  },
  messageTime: {
    fontSize: 12,
    color: "#999",
  },
  showMoreText: {
    color: "green",
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "green",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Chat;
