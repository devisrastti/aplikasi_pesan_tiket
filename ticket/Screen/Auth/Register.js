import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Easing,
  Image,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import bg from "../../assets/sepit.jpg";

const Register = () => { 
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const API_URL = "http://192.168.164.188";
  // const API_URL = "http://192.168.0.122"

  const navigate = useNavigation();
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(shakeAnimation, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, []);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateEmail = (text) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    setEmail(text);

    if (emailRegex.test(text)) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  };

  const validatePassword = (text) => {
    setPassword(text);

    if (text.length < 6) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const validateConfirmPassword = (text) => {
    setConfirmPassword(text);

    if (text !== password) {
      setConfirmPasswordError(true);
    } else {
      setConfirmPasswordError(false);
    }
  };

  const handleRegister = () => {
    const data = {
      username: username,
      email: email,
      password: password,
    };
  
    axios
      .post(`${API_URL}:3003/register`, data)
      .then((response) => {
        // Handle registration success
        console.log(response.data);
        navigate.navigate("Login"); // Navigate to the Login screen
      })
      .catch((error) => {
        // Handle registration error
        // console.error(error.response.data.message);
        setErrorMessage(error.response.data.message);
        shakeAnimation.setValue(0);
        Animated.timing(shakeAnimation, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start();
      });
  };
  
  const isButtonDisabled =
    emailError ||
    passwordError ||
    confirmPasswordError ||
    email.trim() === "" ||
    username.trim() === "" ||
    password.trim() === "" ||
    confirmPassword.trim() === "";

  const shakeAnimationStyle = {
    transform: [
      {
        translateX: shakeAnimation.interpolate({
          inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
          outputRange: [0, -10, 10, -10, 10, -10, 10, -10, 10, -10, 0],
        }),
      },
    ],
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorMessage("");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [errorMessage]);

  return (
    <Animated.View style={[styles.container, { opacity: shakeAnimation }]}>
      <View style={styles.logoContainer}>
        <Image source={bg} style={styles.logo} />
      </View>
      <Animated.View style={[styles.inputContainer, shakeAnimationStyle]}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
      </Animated.View>
      <Animated.View style={[styles.inputContainer, shakeAnimationStyle]}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={validateEmail}
        />
      </Animated.View>
      {emailError && <Text style={styles.errorText}>Email tidak sesuai</Text>}
      <View style={styles.passwordContainer}>
        <Animated.View style={[styles.passwordInputContainer, shakeAnimationStyle]}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={validatePassword}
          />
        </Animated.View>
        <TouchableOpacity
          style={styles.eyeIconContainer}
          onPress={togglePasswordVisibility}
        >
          <Feather name={passwordVisible ? "eye-off" : "eye"} size={24} color="#777" />
        </TouchableOpacity>
      </View>
      {passwordError && (
        <Text style={styles.errorText}>
          Password harus lebih dari 6 karakter
        </Text>
      )}
      <View style={styles.passwordContainer}>
        <Animated.View style={[styles.passwordInputContainer, shakeAnimationStyle]}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            secureTextEntry={!passwordVisible}
            value={confirmPassword}
            onChangeText={validateConfirmPassword}
          />
        </Animated.View>
      </View>
      {confirmPasswordError && (
        <Text style={styles.errorText}>Passwords tidak cocok</Text>
      )}
      {errorMessage !== "" && (
        <Animated.View style={[styles.errorTextContainer, shakeAnimationStyle]}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </Animated.View>
      )}
      <TouchableOpacity
        style={[styles.button, isButtonDisabled ? styles.disabledButton : null]}
        onPress={handleRegister}
        disabled={isButtonDisabled}
      >
        <Text style={styles.buttonText}>
          <Feather name="user" size={24} color="white" />
          {" Register"}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    width: "80%",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#777",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  input: {
    fontSize: 16,
  },
  passwordContainer: {
    width: "80%",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#777",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  passwordInputContainer: {
    flex: 1,
  },
  passwordInput: {
    fontSize: 16,
  },
  eyeIconContainer: {
    marginLeft: 10,
  },
  button: {
    width: "80%",
    backgroundColor: "#008000",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  errorTextContainer: {
    alignItems: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 2,
    marginTop: -100,
  },
  logo: {
    width: 450,
    height: 350,
    borderRadius: 75,
  },
});

export default Register;
