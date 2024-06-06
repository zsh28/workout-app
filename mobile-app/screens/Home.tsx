import { useState, useCallback } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import instance from "../api/Api";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

interface Workout {
  _id: string;
  title: string;
  load: number;
  reps: number;
  createdAt: string; // Add this field if not present
}

const HomeScreen = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchWorkouts = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setLoading(false);
        navigation.navigate("Login" as never);
        return;
      }

      const response = await instance.get("/workouts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setWorkouts(response.data);
      } else {
        Alert.alert("Error", "Failed to fetch workouts");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to fetch workouts");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchWorkouts();
    }, [])
  );

  const handleDelete = async (workoutId: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        navigation.navigate("Login" as never);
        return;
      }

      const response = await instance.delete(`/workouts/${workoutId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setWorkouts((prevWorkouts) =>
          prevWorkouts.filter((workout) => workout._id !== workoutId)
        );
        Alert.alert("Success", "Workout deleted successfully");
      } else {
        Alert.alert("Error", "Failed to delete workout");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to delete workout");
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <FlatList
            data={workouts}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.workoutItem}>
                <Text style={styles.title}>{item.title}</Text>
                <Text>Load: {item.load} kg</Text>
                <Text>Reps: {item.reps}</Text>
                <Text>
                  Created:{" "}
                  {formatDistanceToNow(new Date(item.createdAt), {
                    addSuffix: true,
                  })}
                </Text>
                <TouchableOpacity onPress={() => handleDelete(item._id)}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <Button
            title="Add Workout"
            onPress={() => navigation.navigate("AddWorkout" as never)}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  workoutItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  deleteButton: {
    color: "red",
    marginTop: 10,
  },
});

export default HomeScreen;
