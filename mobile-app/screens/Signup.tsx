import { useState } from "react";
import { View, TextInput, Button, Text, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import instance from "../api/Api";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigation();
  const handlerLogin = () => {
    nav.navigate("Login" as never);
  };

  const register = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Error", "Email and password are required");
        return;
      }
      const response = await instance.post("/user/signup", { email, password });
      console.log(response.data);
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
      <Button title="Register" onPress={register} />
      <View style={styles.buttonContainer}>
        <Text>Already have an account?</Text>
        <Button title="Login" onPress={handlerLogin} />
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

export default RegisterScreen;
