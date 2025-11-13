import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/auth-context";
import ThemedButton from "@/components/themed-button";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    Alert.alert("Log out?", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          try {
            setBusy(true);
            await signOut();
          } catch (err) {
            console.warn("Sign out failed", err);
            Alert.alert("Sign out failed", "Please try again.");
          } finally {
            setBusy(false);
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <Image source={require("../../assets/logo.png")} />
        </View>

        <Text style={styles.label}>signed in as</Text>
        <Text style={styles.name}>{user?.username ?? "unknown"}</Text>

        <View style={{ flex: 1 }} />

        <ThemedButton
          style={[styles.signBtn, busy && { opacity: 0.6 }]}
          onPress={handleLogout}
          disabled={busy}
        >
          <Text style={styles.signBtnText}>
            {busy ? "Signing out..." : "Log out"}
          </Text>
        </ThemedButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbfbf9" },
  inner: { flex: 1, padding: 20, alignItems: "center" },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#e9e6f6",
    marginTop: 18,
    marginBottom: 18,
  },

  label: {
    textTransform: "lowercase",
    color: "#666",
    marginTop: 8,
    fontSize: 14,
  },

  header: {
    alignItems: "center",
    gap: 30,
    margin: 0,
  },

  name: {
    fontSize: 34,
    fontWeight: "700",
    marginTop: 6,
    textTransform: "none",
  },

  signBtn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#f9e9ee",
    borderWidth: 1,
    borderColor: "#111",
    alignItems: "center",
    marginBottom: 24,
  },
  signBtnText: { fontWeight: "700" },
});
