import React, { useState, useContext } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import instance from "../api/Api";

const AddWorkoutScreen = () => {
  const [title, setTitle] = useState<string>('');
  const [load, setLoad] = useState<string>('');
  const [reps, setReps] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigation = useNavigation();

  const addWorkout = async () => {
    if (!title || !load || !reps) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "User not authenticated");
        navigation.navigate('Login' as never);
        return;
      }

      const response = await instance.post('/workouts', {
        title,
        load: parseInt(load),
        reps: parseInt(reps)
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        Alert.alert("Success", "Workout added successfully");
        navigation.navigate('Home' as never);
      } else {
        Alert.alert("Error", response.data.error || "Error adding workout");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error adding workout");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Load (kg)"
        value={load}
        onChangeText={setLoad}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Reps"
        value={reps}
        onChangeText={setReps}
        keyboardType="numeric"
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Add Workout" onPress={addWorkout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
});

export default AddWorkoutScreen;
