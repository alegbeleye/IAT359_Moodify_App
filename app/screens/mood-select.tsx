import React from "react";
import ThemedButton from "@/components/themed-button";
import { ThemedView } from "@/components/themed-view";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

const moods = [
  { id: "loved", label: "loved", emoji: "❤️" },
  { id: "content", label: "content", emoji: "😊" },
  { id: "stressed", label: "stressed", emoji: "😰" },
  { id: "sad", label: "sad", emoji: "😢" },
];

const MoodSelect = ({ navigation }: any) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleCreateEntry = () => {
    if (!selectedMood) {
      alert("Please select a mood");
      return;
    }
    navigation.navigate("CreateEntry", { mood: selectedMood });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 10, paddingLeft: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>back</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>How are you feeling today?</Text>
      </View>
      <View style={styles.moodGrid}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.id}
            style={[
              styles.moodButton,
              selectedMood === mood.id && styles.moodButtonSelected,
            ]}
            onPress={() => setSelectedMood(mood.id)}
          >
            <ThemedView
              style={[
                styles.mood,
                selectedMood === mood.id && styles.moodSelected,
              ]}
            >
              <Text style={styles.emoji}>{mood.emoji}</Text>
              <Text style={styles.moodLabel}>{mood.label}</Text>
            </ThemedView>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <ThemedButton onPress={handleCreateEntry}>
          <Text style={styles.buttonText}>create entry</Text>
        </ThemedButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbfbf9",
  },
  header: {
    alignItems: "center",
    gap: 30,
    margin: 0,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "600",
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  moodButton: {
    width: "45%",
    aspectRatio: 1,
  },
  moodButtonSelected: {},
  mood: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderWidth: 1.8,
    borderColor: "#e0e0e0",
    borderRadius: 8,
  },
  moodSelected: {
    backgroundColor: "#eaf5ff",
    borderColor: "#9cc7ff",
  },
  emoji: {
    fontSize: 40,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 30,
    gap: 12,
  },
  buttonText: {
    fontWeight: "700",
    textAlign: "center",
  },
});

export default MoodSelect;
