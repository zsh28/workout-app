import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

//create a instance of axios with url localhost:4000
const instance = axios.create({
  baseURL: "http://192.168.1.19:4000/api",
});

//add token to async storage
instance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//export the instance
export default instance;
