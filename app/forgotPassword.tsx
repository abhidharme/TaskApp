import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Text, Snackbar } from "react-native-paper";
import AppButton from "@/componets/Button";
import Input from "@/componets/Input";
import { forgotPassword } from "@/constant/api";

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setSnackbarMessage("Email is required!");
      setSnackbarVisible(true);
      return;
    }

    setLoading(true); // Start loader
    try {
      const result = await forgotPassword(email);
      if (result.message) {
        setSnackbarMessage("OTP sent to your email!");
        setSnackbarVisible(true);
        setTimeout(() => {
          router.push({ pathname: "/otpVerify", params: { email } });
        }, 1500); // Slight delay for better UI experience
      } else {
        setSnackbarMessage(result.message || "Failed to send OTP!");
        setSnackbarVisible(true);
      }
    } catch (error: any) {
      setSnackbarMessage(error?.message || "Something went wrong!");
      setSnackbarVisible(true);
    }
    setLoading(false); // Stop loader
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Forgot Password</Text>
      <Input label="Email" value={email} onChangeText={setEmail} />

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <AppButton title="Send OTP" onPress={handleForgotPassword} disabled={loading} />
      )}

      {/* Snackbar for messages */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default ForgotPassword;
