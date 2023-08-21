import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import bg from "../../assets/sepit.jpg";
import AsyncStorage from "@react-native-async-storage/async-storage"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorTimeout, setErrorTimeout] = useState(null);
  const API_URL = "http://192.168.164.188";
  // const API_URL = "http://192.168.0.122"

  const navigate = useNavigation();
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkLoginStatus(); // Check if the user is already logged in
    Animated.timing(shakeAnimation, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        // User data exists, navigate to the Home screen
        navigate.navigate("Nav");
      }
    } catch (error) {
      console.log(error);
    }
  };

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
      setEmailError("Email tidak sesuai");

      // Hapus pesan kesalahan setelah 3 detik
      clearTimeout(errorTimeout);
      const timeout = setTimeout(() => {
        setEmailError("");
      }, 3000);
      setErrorTimeout(timeout);
    }
  };

  const validatePassword = (text) => {
    setPassword(text);

    if (text.length < 6) {
      // setPasswordError(true);
      // setPasswordError("Password harus lebih dari 6 karakter");

      // Hapus pesan kesalahan setelah 3 detik
      clearTimeout(errorTimeout);
      const timeout = setTimeout(() => {
        setPasswordError("");
      }, 3000);
      setErrorTimeout(timeout);
    } else {
      setPasswordError(false);
    }
  };

  const handleLogin = () => {
    const data = {
      email: email,
      password: password,
    };

    axios
      .post(`${API_URL}:3003/login`, data)
      .then(async (response) => {
        // Handle login success
        console.log(response.data);
        try {
          // Save user data to AsyncStorage
          await AsyncStorage.setItem("userData", JSON.stringify(response.data));
        } catch (error) {
          console.log(error);
        }
        navigate.navigate("Nav"); // Navigate to the Home screen
      })
      .catch((error) => {
        // Handle login error
        // console.error(error.response.data.message);
        setErrorMessage(error.response.data.message);
        shakeAnimation.setValue(0);
        Animated.timing(shakeAnimation, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start();
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      });
  };

  const isButtonDisabled =
    emailError ||
    passwordError ||
    email.trim() === "" ||
    password.trim() === "";

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

  return (
    <Animated.View style={[styles.container, { opacity: shakeAnimation }]}>
      <View style={styles.logoContainer}>
        <Image source={bg} style={styles.logo} />
      </View>
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
        <Animated.View
          style={[styles.passwordInputContainer, shakeAnimationStyle]}
        >
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
          <Feather
            name={passwordVisible ? "eye-off" : "eye"}
            size={24}
            color="#777"
          />
        </TouchableOpacity>
      </View>
      {passwordError && (
        <Text style={styles.errorText}>
          Password harus lebih dari 6 karakter
        </Text>
      )}
      {errorMessage !== "" && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
      <TouchableOpacity
        style={[styles.button, isButtonDisabled ? styles.disabledButton : null]}
        onPress={handleLogin}
        disabled={isButtonDisabled}
      >
        <Text style={styles.buttonText}>
          <Feather name="log-in" size={24} color="white" />
          {" Login"}
        </Text>
      </TouchableOpacity>
    
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigate.navigate("Register")}>
          <Text style={styles.footerText}>
            Belum punya akun?{"   "}
            <Text style={styles.footerLinkText}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: -50,
    marginTop: "auto",
  },
  logo: {
    width: 450,
    height: 350,
    borderRadius: 75,
  },
  footer: {
    flexDirection: "row",
    marginTop: "auto",
  },
  footerText: {
    marginRight: 10,
    fontSize: 16,
    color: "#008000",
  },
  footerLinkText: {
    fontWeight: "bold",
    color: "#008000",
  },
});

export default Login;
