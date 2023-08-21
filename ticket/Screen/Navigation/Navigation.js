import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Home from "../Home/Home";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import Forgot from "../Auth/Forgot";
import BottomNav from "./BottomNav";
import Profile from "../Profile/Profile";
import Order from "../Order/Order";
import Jadwal from "../Order/Jadwal";
import Chat from "../Notifikasi/Chat";
import Payment from "../Payment/Payment";
import About from "../Home/About";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#228B22",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
          textAlign: "center",
        },
      }}
    >
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Nav"
        component={BottomNav}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={"Register"}
        component={Register}
        options={{
          title: "",
          headerLeft: () => (
            <Ionicons
              name="chevron-back-outline"
              size={30}
              color={"white"}
              style={{ marginLeft: 0, marginRight: 15 }}
              onPress={handleGoBack}
            />
          ),
        }}
      />
      <Stack.Screen
        name={"ForgotPassword"}
        component={Forgot}
        options={{
          title: "Pusat Bantuan",
          headerLeft: () => (
            <Ionicons
              name="chevron-back-outline"
              size={30}
              color={"white"}
              style={{ marginLeft: 0, marginRight: 15 }}
              onPress={handleGoBack}
            />
          ),
        }}
      />

      <Stack.Screen
        name={"Profile"}
        component={Profile}
        options={{
          title: "Profile",
          headerLeft: () => (
            <Ionicons
              name="chevron-back-outline"
              size={30}
              color={"white"}
              style={{ marginLeft: 0, marginRight: 15 }}
              onPress={handleGoBack}
            />
          ),
        }}
      />

      <Stack.Screen
        name={"Tiket"}
        component={Order}
        options={{
          title: "Tiket",
          headerLeft: () => (
            <Ionicons
              name="chevron-back-outline"
              size={30}
              color={"white"}
              style={{ marginLeft: 0, marginRight: 15 }}
              onPress={handleGoBack}
            />
          ),
        }}
      />

      <Stack.Screen
        name={"Jadwal"}
        component={Jadwal}
        options={{
          title: "Jadwal",
          headerLeft: () => (
            <Ionicons
              name="chevron-back-outline"
              size={30}
              color={"white"}
              style={{ marginLeft: 0, marginRight: 15 }}
              onPress={handleGoBack}
            />
          ),
        }}
      />

      <Stack.Screen
        name={"Chat"}
        component={Chat}
        options={{
          title: "Chat",
          headerLeft: () => (
            <Ionicons
              name="chevron-back-outline"
              size={30}
              color={"white"}
              style={{ marginLeft: 0, marginRight: 15 }}
              onPress={handleGoBack}
            />
          ),
        }}
      />
      <Stack.Screen
        name={"Pembayaran"}
        component={Payment}
        options={{
          title: "Pembayaran",
          headerLeft: () => (
            <Ionicons
              name="chevron-back-outline"
              size={30}
              color={"white"}
              style={{ marginLeft: 0, marginRight: 15 }}
              onPress={handleGoBack}
            />
          ),
        }}
      />
      <Stack.Screen
        name={"Syarat"}
        component={About}
        options={{
          title: "Tentang Kami",
          headerLeft: () => (
            <Ionicons
              name="chevron-back-outline"
              size={30}
              color={"white"}
              style={{ marginLeft: 0, marginRight: 15 }}
              onPress={handleGoBack}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default Navigation;
