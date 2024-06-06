import "react-native-gesture-handler";
import { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import HomeScreen from "./screens/Home";
import LoginScreen from "./screens/Login";
import RegisterScreen from "./screens/Signup";
import SettingsScreen from "./screens/Settings";
import AddWorkoutScreen from "./screens/Form";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import instance from "./api/Api";

const Stack = createNativeStackNavigator();

const App = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        try {
          const response = await instance.get("/user/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data.user);
        } catch (error) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? "Home" : "Login"}
        screenOptions={({ navigation, route }) => ({
          headerLeft: () => {
            const routeName = route.name;
            if (routeName === "Home") {
              return (
                <Ionicons
                  name="settings-outline"
                  onPress={() => navigation.navigate("Settings")}
                  size={20}
                  style={{ marginRight: 15 }}
                  color="black"
                />
              );
            }
            return null;
          },
          headerStyle: {
            backgroundColor: "#f8f8f8",
          },
          headerTitleStyle: {
            color: "black",
          },
          headerTitleAlign: "center",
          headerTintColor: "black",
        })}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddWorkout" component={AddWorkoutScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
};

export default App;
