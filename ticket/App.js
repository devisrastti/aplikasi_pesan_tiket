import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./Screen/Navigation/Navigation";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="green" barStyle="light-content" />
      <Navigation />
    </NavigationContainer>
  );
}
