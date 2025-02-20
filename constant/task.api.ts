import { getToken } from "@/utils/storage";
import axios from "axios";

const API_URL = "https://task-app-8d2x.onrender.com/api/tasks";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Add Authorization token to every request
axiosInstance.interceptors.request.use(async (config) => {
  const token = await getToken("authToken");
  console.log({token})
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get all tasks
export const getTasks = async () => {
  const response = await axiosInstance.get("/");
  return response.data;
};

// Create a new task
export const createTask = async (task: { title: string; description: string }) => {
  const response = await axiosInstance.post("/", task);
  return response.data;
};

// Update a task
export const updateTask = async (taskId: string, task: { title: string; description: string }) => {
  const response = await axiosInstance.put(`/${taskId}`, task);
  return response.data;
};

// Delete a task
export const deleteTask = async (taskId: string) => {
  await axiosInstance.delete(`/${taskId}`);
};
