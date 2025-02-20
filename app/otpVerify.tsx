import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Text, Snackbar } from "react-native-paper";
import AppButton from "@/componets/Button";
import Input from "@/componets/Input";
import { verifyOTP } from "@/constant/api";

const OtpVerify = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>(); // Get email from params
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state

  const handleVerifyOtp = async () => {
    if (!otp.trim() || !newPassword.trim()) {
      setSnackbarMessage("OTP and new password are required!");
      setSnackbarVisible(true);
      return;
    }

    setLoading(true); // Start loading
    try {
      const result = await verifyOTP(email, otp, newPassword);
      if (result.message) {
        setSnackbarMessage("OTP Verified! Password reset successfully.");
        setSnackbarVisible(true);
        setTimeout(() => router.replace("/login"), 500);
      } else {
        setSnackbarMessage(result.message || "Invalid OTP!");
        setSnackbarVisible(true);
      }
    } catch (error: any) {
      setSnackbarMessage(error?.message || "Something went wrong!");
      setSnackbarVisible(true);
    }
    setLoading(false); // Stop loading
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>OTP sent to: {email}</Text>
      <Input label="Enter OTP" value={otp} onChangeText={setOtp} />
      <Input label="New Password" value={newPassword} onChangeText={setNewPassword} secureTextEntry />

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <AppButton title="Verify OTP & Reset Password" onPress={handleVerifyOtp} disabled={loading} />
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
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 20,
    color: "gray",
  },
});

export default OtpVerify;
