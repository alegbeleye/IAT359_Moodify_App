import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useAuth } from "../../context/auth-context";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen({ navigation }: any) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSignUp() {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Password must be at least 6 characters");
      return;
    }
    setBusy(true);
    try {
      await signUp({ email, password });
    } catch (err: any) {
      Alert.alert("Sign up failed", err.message ?? "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        <View style={{ padding: 20 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: "#111" }}>back</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 18 }}>
            <View style={styles.logo}>
              <Image source={require("../../assets/logo.png")} />
              <Text style={styles.header}>create an account</Text>
            </View>

            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              style={[styles.input, { marginTop: 12 }]}
              secureTextEntry
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={[styles.input, { marginTop: 12 }]}
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={styles.signBtn}
              onPress={handleSignUp}
              disabled={busy}
            >
              <Text style={styles.signBtnText}>
                {busy ? "Creating..." : "Create account"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbfbf9" },
  header: { fontSize: 28, fontWeight: "700" },
  input: {
    borderWidth: 1.8,
    borderColor: "#111",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    marginTop: 12,
  },
  logo: { alignItems: "center", gap: 20, marginBottom: 50 },
  signBtn: {
    marginTop: 18,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#f9e9ee",
    borderWidth: 1,
    borderColor: "#111",
    alignItems: "center",
  },
  signBtnText: { fontWeight: "700" },
});
