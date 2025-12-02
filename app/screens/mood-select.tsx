import ThemedButton from "@/components/themed-button";
import { ThemedView } from "@/components/themed-view";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MoodSelect = ({ navigation }: any) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // when user confirms their mood, save whether they have been onboarded and the last mood they inputted; then, navigate back to dashboard
  const handleMoodConfirm =async () => {
    if(!selectedMood) return; // no mood selected

    await AsyncStorage.setItem("hasOnboarded", "true");
    await AsyncStorage.setItem("lastMood", selectedMood);

    navigation.navigate("Dashboard");
  };

  return (
    <SafeAreaView>
      <View style={{ padding: 10, paddingLeft: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>back</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Image source={require("../../assets/logo.png")} />
        <Text style={styles.title}>Select your current mood</Text>
      </View>
      <View style={styles.container}>
        <TouchableOpacity style={styles.moodButton} onPress={() => setSelectedMood("loved")}>
          <ThemedView style={styles.mood}>
            <Image source={require("../../assets/moods/loved.png")} />
            <Text>loved</Text>
          </ThemedView>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moodButton} onPress={() => setSelectedMood("content")}>
          <ThemedView style={styles.mood}>
            <Image source={require("../../assets/moods/content.png")} />
            <Text>Content </Text>
          </ThemedView>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moodButton} onPress={() => setSelectedMood("stressed")}>
          <ThemedView style={styles.mood}>
            <Image source={require("../../assets/moods/stressed.png")} />
            <Text>Stressed </Text>
          </ThemedView>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moodButton} onPress={() => setSelectedMood("sad")}>
          <ThemedView style={styles.mood}>
            <Image source={require("../../assets/moods/sad.png")} />
            <Text>Sad </Text>
          </ThemedView>
        </TouchableOpacity>
      </View>
      <ThemedButton onPress={handleMoodConfirm}>
        <Text>continue</Text>
      </ThemedButton>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    margin: 20,
    backgroundColor: "none",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    rowGap: 15,
    columnGap: 10,
    height: 479,
    flexWrap: "wrap",
  },

  moodButton: {
    width: "45%",
    height: "45%",
    textAlign: "center",
    alignItems: "center",
  },

  mood: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    textAlign: "center",
  },

  title: {
    fontSize: 24,
    textAlign: "center",
  },

  header: {
    alignItems: "center",
    gap: 30,
    margin: 0,
  },
});
export default MoodSelect;
