import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Text, Snackbar } from "react-native-paper";
import AppButton from "@/componets/Button";
import Input from "@/componets/Input";
import { loginUser } from "@/constant/api";
import { getToken, saveToken } from "@/utils/storage";
import Loader from "@/componets/Loader";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await getToken("authToken");
      if (token) {
        router.replace("/");
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setSnackbarMessage("Email and password are required!");
      setSnackbarVisible(true);
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser(email, password);
      if (result.token) {
        await saveToken(result.token);
        router.replace("/");
      } else {
        setSnackbarMessage(result.message || "Login failed!");
        setSnackbarVisible(true);
      }
    } catch (error: any) {
      setSnackbarMessage(error?.message || "Something went wrong!");
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text variant="headlineMedium" style={styles.title}>
          Welcome Back
        </Text>
        <Text style={styles.subtitle}>
          Please login to continue
        </Text>

        <View style={styles.inputContainer}>
          <Input 
            label="Email" 
            value={email} 
            onChangeText={setEmail}
          />
          <Input 
            label="Password" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          onPress={() => router.push("/forgotPassword")}
          style={styles.forgotPasswordContainer}
        >
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <AppButton 
          title="Login" 
          onPress={handleLogin} 
          disabled={loading}
        />

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>
            Don't have an account?{" "}
            <Text 
              style={styles.signUpLink}
              onPress={() => router.push("/register")}
            >
              Sign Up
            </Text>
          </Text>
        </View>
      </View>

      <Snackbar 
        visible={snackbarVisible} 
        onDismiss={() => setSnackbarVisible(false)} 
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>

      {loading && <Loader />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginHorizontal: 10,
  },
  title: {
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  inputContainer: {
    gap: 16,
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginTop: 8,
    marginBottom: 24,
  },
  forgotPassword: {
    color: "#6200EE",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#6200EE",
    borderRadius: 8,
    paddingVertical: 8,
  },
  signUpContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  signUpText: {
    color: "#666",
    fontSize: 14,
  },
  signUpLink: {
    color: "#6200EE",
    fontWeight: "600",
  },
  snackbar: {
    zIndex: 900,
  },
});

export default Login;