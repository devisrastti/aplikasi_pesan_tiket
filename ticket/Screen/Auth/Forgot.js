import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [token, setToken] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [hideErrorTimeout, setHideErrorTimeout] = useState(null);

  const navigate = useNavigation();
  const API_URL = "http://192.168.164.188"
  // const API_URL = "http://192.168.0.122"

  const validateEmail = (text) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    setEmail(text);

    if (emailRegex.test(text)) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  };

  const handleResetPassword = async () => {
    if (emailError || email.trim() === "") {
      return;
    }

    setIsSending(true);

    try {
      // Pengecekan email di server sebelum mengirim permintaan
      const checkEmailResponse = await axios.post(
        `${API_URL}:3003/check-email`,
        {
          email: email,
        }
      );

      if (checkEmailResponse.data.exists) {
        const response = await axios.post(
          `${API_URL}:3003/forgot-password`,
          {
            email: email,
          }
        );

        setIsSending(false);
        setIsSent(response.status === 200);
      } else {
        setIsSending(false);
        setError(`Email ${email} tidak ditemukan.`);
        startHideErrorTimeout();
      }
    } catch (error) {
      setIsSending(false);
      console.error(error);
    }
  };

  const handleSubmitToken = async () => {
    try {
      const response = await axios.post(`${API_URL}:3003/verify-token`, {
        token: token,
        email: email,
      });
  
      if (response.status === 200) {
        setIsTokenValid(true);
        console.log("Token is valid");
  
        // Hapus token berdasarkan email
        await axios.delete(`${API_URL}:3003/delete-token`, {
          data: {
            email: email,
          },
        });
  
        console.log("Token deleted");
      } else {
        setIsTokenValid(false);
        setError("Token is invalid.");
        startHideErrorTimeout();
      }
    } catch (error) {
      setError("Token Salah");
      startHideErrorTimeout();
    }
  };
  
  const handleChangePassword = async () => {
    setIsSending(true);

    try {
      const response = await axios.post(
        `${API_URL}:3003/update-password`,
        {
          email: email,
          password: newPassword,
        }
      );

      setIsSending(false);
      if (response.status === 200) {
        setIsSent(false); 
        navigate.navigate("Login")
      
          
      } else {
        console.log("Failed to update password");
      }
    } catch (error) {
      setIsSending(false);
      console.error(error);
    }
  };

  const startHideErrorTimeout = () => {
    clearTimeout(hideErrorTimeout);
    const timeout = setTimeout(() => {
      setError("");
    }, 3000);
    setHideErrorTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      clearTimeout(hideErrorTimeout);
    };
  }, []);

  if (isSent && isTokenValid) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Reset Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          value={email}
          onChangeText={validateEmail}
          editable={false}
        />

        <TextInput
          style={styles.input}
          placeholder="New Password"
          autoCapitalize="none"
          secureTextEntry={true}
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      {isSent ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Token"
            autoCapitalize="none"
            value={token}
            onChangeText={setToken}
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmitToken}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={[styles.input, emailError && styles.inputError]}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={validateEmail}
          />
          {emailError && <Text style={styles.errorText}>Invalid email</Text>}
          <TouchableOpacity
            style={[
              styles.button,
              isSending || emailError ? styles.disabledButton : null,
            ]}
            onPress={handleResetPassword}
            disabled={isSending || emailError}
          >
            {isSending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Reset Password</Text>
            )}
          </TouchableOpacity>
        </>
      )}
      {error !== "" && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#008000",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    marginBottom:20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
