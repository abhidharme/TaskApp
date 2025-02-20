import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export const saveToken = async (token:any) => {
  await AsyncStorage.setItem("authToken", token);
};

export const getToken = async (p0: string) => {
  return await AsyncStorage.getItem("authToken");
};

export const removeToken = async () => {
  await AsyncStorage.removeItem("authToken");
  router.push('/login')
};
