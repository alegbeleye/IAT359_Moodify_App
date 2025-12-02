import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/auth-context";
import locationService, { LocationData } from "@/services/location";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const moodEmojis: Record<string, string> = {
  loved: "❤️",
  content: "😊",
  stressed: "😰",
  sad: "😢",
};

export default function CreateEntryScreen({ navigation, route }: any) {
  const { user } = useAuth();
  const { mood: initialMood } = route.params || {};
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState<string>(
    initialMood || "content"
  );
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  async function getCurrentLocation() {
    try {
      setLoading(true);
      const locationData = await locationService.getCurrentLocation();
      setLocation(locationData);
    } catch (error) {
      console.error("Failed to get location:", error);
      Alert.alert("Location Error", "Could not get your current location");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveEntry() {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "Please fill in title and content");
      return;
    }

    if (!location) {
      Alert.alert("Error", "Location is required");
      return;
    }

    try {
      setSaving(true);
      await locationService.createJournalEntry(
        user!.id,
        title,
        content,
        selectedMood,
        location
      );
      Alert.alert("Success", "Entry saved!", [
        {
          text: "OK",
          onPress: () => {
            navigation.popToTop();
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to save entry");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#111" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>new entry</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <Text style={styles.label}>title</Text>
            <TextInput
              style={styles.input}
              placeholder="What's on your mind?"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#ccc"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>how are you feeling?</Text>
            <View style={styles.moodContainer}>
              {Object.entries(moodEmojis).map(([mood, emoji]) => (
                <TouchableOpacity
                  key={mood}
                  style={[
                    styles.moodButton,
                    selectedMood === mood && styles.moodButtonSelected,
                  ]}
                  onPress={() => setSelectedMood(mood)}
                >
                  <Text style={styles.moodEmoji}>{emoji}</Text>
                  <Text style={styles.moodLabel}>{mood}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>your thoughts</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Write your journal entry here..."
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={8}
              placeholderTextColor="#ccc"
              textAlignVertical="top"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>location</Text>
            <View style={styles.locationBox}>
              <MaterialCommunityIcons
                name="map-marker"
                size={18}
                color="#111"
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.locationText}>{location?.address}</Text>
                <Text style={styles.coordinates}>
                  {location?.latitude.toFixed(4)},{" "}
                  {location?.longitude.toFixed(4)}
                </Text>
              </View>
              <TouchableOpacity onPress={getCurrentLocation}>
                <MaterialCommunityIcons name="refresh" size={18} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, saving && { opacity: 0.6 }]}
            onPress={handleSaveEntry}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? "saving..." : "save entry"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbfbf9",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "lowercase",
  },
  input: {
    borderWidth: 1.8,
    borderColor: "#111",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 150,
    paddingTop: 12,
  },
  moodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  moodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1.8,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  moodButtonSelected: {
    borderColor: "#111",
    backgroundColor: "#f9e9ee",
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "lowercase",
  },
  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.8,
    borderColor: "#111",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  locationText: {
    fontSize: 14,
    fontWeight: "600",
  },
  coordinates: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#f9e9ee",
    borderWidth: 1,
    borderColor: "#111",
    alignItems: "center",
    marginTop: 12,
  },
  saveButtonText: {
    fontWeight: "700",
    fontSize: 14,
  },
});
