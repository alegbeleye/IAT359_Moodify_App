import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MoodTracker from "../../components/mood-tracker";
import PlaylistCardSmall from "../../components/playlist-card-small";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@react-navigation/elements";
import ThemedButton from "@/components/themed-button";
import { useAuth } from "@/context/auth-context";

export default function DashboardScreen({ navigation }: any) {
  const { user, loading } = useAuth();

  // when on dashboard, check if user has gone through onboarding; if not boarded yet, redirect to Mood Select screen
  useEffect(() => {
    async function checkOnboarding(){
      const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");

      // redirecting user if onboarding has not been completed
      if(!hasOnboarded){
        navigation.navigate("MoodSelect");
      }
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.header}>
          <Image source={require("../../assets/logo.png")} />
          <Text style={styles.greet}>good morning,</Text>
          <Text style={styles.name}>{user?.name}</Text> 
        </View>

        <MoodTracker />

        <ThemedView>
          <Text style={styles.cardTitle}>
            You've already filled out today's entry ✨
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("MoodSelect")}>
            <Text style={styles.link}>{"[view/edit entry]"}</Text>
          </TouchableOpacity>
        </ThemedView>

        <PlaylistCardSmall onPress={() => navigation.navigate("Playlist")} />

        <ThemedButton
          style={styles.viewAll}
          onPress={() => navigation.navigate("Entries")}
        >
          <Text>View all entries</Text>
        </ThemedButton>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbfbf9" },
  header: { alignItems: "center", marginBottom: 10 },
  flower: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e9e6f6",
    marginTop: 8,
    marginBottom: 8,
  },
  greet: { textTransform: "lowercase", fontSize: 18 },
  name: { fontSize: 34, fontWeight: "600", marginTop: 6 },
  card: {
    borderWidth: 2,
    borderColor: "#111",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
    marginVertical: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  link: { marginTop: 8, color: "#6b7280" },
  viewAll: {
    alignSelf: "center",
    marginTop: 16,
    width: "100%",
    alignItems: "center",
  },
});
