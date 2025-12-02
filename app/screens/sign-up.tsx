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

export default function SignUpScreen({ navigation }: any) {
  const { signUp } = useAuth();
  const [name, setName] = useState(""); // add name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSignUp() {
    if (!name || !email || !password) {
      Alert.alert("Please fill in all fields");
      return;
    }
    
    if (password.length < 6) {
      Alert.alert("Password must be at least 6 characters");
      return;
    }
    
    setBusy(true);
    try {
      await signUp({ name, username: email, password }); // add name to pass
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
              placeholder="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              autoCapitalize="words"
            />
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