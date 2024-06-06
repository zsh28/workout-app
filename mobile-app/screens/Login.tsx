import { useState } from "react";
import { View, TextInput, Button, Text, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import instance from "../api/Api";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigation();
  const handlerRegister = () => {
    nav.navigate("Register" as never);
  };

  const login = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Error", "Email and password are required");
        return;
      }
      const response = await instance.post("/user/login", { email, password });
      await AsyncStorage.setItem("token", response.data.token);
      nav.navigate("Home" as never);
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Invalid email or password"
      );
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        keyboardType="email-address"
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={login} />
      <View style={styles.buttonContainer}>
        <Text>Don't have an account?</Text>
        <Button title="Register" onPress={handlerRegister} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});

export default LoginScreen;
