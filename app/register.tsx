import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Snackbar } from "react-native-paper";
import { useRouter } from "expo-router";
import Input from "@/componets/Input";
import AppButton from "@/componets/Button";
import { registerUser } from "@/constant/api";
import { getToken } from "@/utils/storage";
import Loader from "@/componets/Loader";

const Register = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await getToken("authToken");
      if (token) {
        router.replace("/"); 
      }
    };
    checkLoginStatus();
  }, []);

  const validateInputs = () => {
    let valid = true;
    let newErrors: { name?: string; email?: string; password?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email address";
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const result = await registerUser(name, email, password);
      
      if (result.success) {
        setSnackbarMessage("Registration successful!");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setSnackbarMessage(result.message || "Registration failed!");
      }
    } catch (error) {
      let mess: any = error;
      setSnackbarMessage(mess?.message || "Something went wrong!");
    } finally {
      setLoading(false);
      setSnackbarVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text variant="headlineMedium" style={styles.title}>
          Create Account
        </Text>
        <Text style={styles.subtitle}>
          Sign up to get started
        </Text>

        <View style={styles.inputContainer}>
          <Input 
            label="Name" 
            value={name} 
            onChangeText={setName}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <Input 
            label="Email" 
            value={email} 
            onChangeText={setEmail}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <Input 
            label="Password" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        <AppButton 
          title="Register" 
          onPress={handleRegister} 
          disabled={loading}
        />

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text 
              style={styles.loginLink}
              onPress={() => !loading && router.push("/login")}
            >
              Login
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
  errorText: {
    color: "#ff3b30",
    fontSize: 12,
    marginTop: -12,
    marginBottom: 4,
  },
  registerButton: {
    backgroundColor: "#6200EE",
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 24,
  },
  loginContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    color: "#666",
    fontSize: 14,
  },
  loginLink: {
    color: "#6200EE",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  snackbar: {
    zIndex: 900,
  },
});

export default Register;