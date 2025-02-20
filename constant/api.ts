import axios from "axios";

const API_BASE_URL = "https://task-app-8d2x.onrender.com/api/auth";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Register User
export const registerUser = async (name: string, email: string, password: string) => {
  try {
    const { data } = await api.post("/signup", { name, email, password });
    return data;
  } catch (error: any) {
    throw error.response?.data || "Registration failed";
  }
};

// Login User
export const loginUser = async (email: string, password: string) => {
  try {
    const { data } = await api.post("/login", { email, password });
    return data;
  } catch (error: any) {
    throw error.response?.data || "Login failed";
  }
};

// Forgot Password
export const forgotPassword = async (email: string) => {
  try {
    const { data } = await api.post("/forgot-password", { email });
    return data;
  } catch (error: any) {
    throw error.response?.data || "Failed to send reset email";
  }
};

// Verify OTP and Reset Password
export const verifyOTP = async (email: string, otp: string, newPassword: string) => {
  try {
    const { data } = await api.post("/verify-otp", { email, otp, newPassword });
    return data;
  } catch (error: any) {
    throw error.response?.data || "OTP verification failed";
  }
};
