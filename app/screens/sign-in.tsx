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
import { StackScreenProps } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";

type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export default function SignInScreen({ navigation }: any) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSignIn() {
    if (!email || !password) {
      Alert.alert("Please enter email and password");
      return;
    }
    setBusy(true);
    try {
      await signIn({ username: email, password });
    } catch (err: any) {
      Alert.alert("Sign in failed", err.message ?? "Unknown error");
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
          <View style={styles.logo}>
            <Image source={require("../../assets/logo.png")} />
          </View>
          <Text style={styles.brand}>moodly</Text>
          <Text style={styles.subtitle}>
            Lorem ipsum dolor sit amet, {"\n"}consectetur adipiscing elit.
          </Text>

          <View style={{ marginTop: 20 }}>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
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

            <TouchableOpacity
              style={styles.signBtn}
              onPress={handleSignIn}
              disabled={busy}
            >
              <Text style={styles.signBtnText}>
                {busy ? "Signing in..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("SignUp")}
              style={{ marginTop: 10 }}
            >
              <Text style={styles.create}>[create an account]</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbfbf9" },
  flower: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#e9e6f6",
    alignSelf: "center",
    marginTop: 18,
  },
  brand: {
    fontSize: 36,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 12,
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginTop: 8,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1.8,
    borderColor: "#111",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
  },
  signBtn: {
    marginTop: 18,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#f9e9ee",
    borderWidth: 1,
    borderColor: "#111",
    alignItems: "center",
  },
  logo: { alignItems: "center" },
  signBtnText: { fontWeight: "700" },
  create: { color: "#6b7280", textAlign: "center" },
});