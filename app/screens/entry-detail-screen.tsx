import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import locationService, { JournalEntry } from "@/services/location";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/auth-context";

const moodEmojis: Record<string, string> = {
  loved: "❤️",
  content: "😊",
  stressed: "😰",
  sad: "😢",
};

export default function EntryDetailScreen({ navigation, route }: any) {
  const { user } = useAuth();
  const { entryId, entry: passedEntry } = route.params || {};
  const [entry, setEntry] = useState<JournalEntry | null>(passedEntry || null);
  const [loading, setLoading] = useState(!passedEntry);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedMood, setEditedMood] = useState("");

  useEffect(() => {
    // If entry was passed, use it directly
    if (passedEntry) {
      setEntry(passedEntry);
      setEditedTitle(passedEntry.title);
      setEditedContent(passedEntry.content);
      setEditedMood(passedEntry.mood);
      setLoading(false);
    } else if (entryId && user) {
      // Otherwise load it by ID
      loadEntry();
    }
  }, [entryId, passedEntry, user]);

  async function loadEntry() {
    if (!user) {
      Alert.alert("Error", "User not authenticated");
      navigation.goBack();
      return;
    }

    try {
      setLoading(true);
      console.log("Loading entry with ID:", entryId);
      const entries = await locationService.getUserJournalEntries(user.id);
      console.log("Total entries found:", entries.length);
      console.log("Looking for entry ID:", entryId);

      const found = entries.find((e) => e.id === entryId);
      console.log("Entry found:", found);

      if (found) {
        setEntry(found);
        setEditedTitle(found.title);
        setEditedContent(found.content);
        setEditedMood(found.mood);
      } else {
        Alert.alert("Error", "Entry not found. ID: " + entryId);
        navigation.goBack();
      }
    } catch (error) {
      console.error("Load entry error:", error);
      Alert.alert("Error", "Failed to load entry: " + String(error));
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveEdit() {
    if (!editedTitle.trim() || !editedContent.trim()) {
      Alert.alert("Error", "Title and content cannot be empty");
      return;
    }

    try {
      await locationService.updateJournalEntry(entryId, {
        title: editedTitle,
        content: editedContent,
        mood: editedMood,
      });
      setEntry({
        ...entry!,
        title: editedTitle,
        content: editedContent,
        mood: editedMood,
      });
      setIsEditing(false);
      Alert.alert("Success", "Entry updated!");
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Failed to update entry");
    }
  }

  async function handleDelete() {
    Alert.alert("Delete Entry", "Are you sure you want to delete this entry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await locationService.deleteJournalEntry(entryId);
            navigation.goBack();
            Alert.alert("Success", "Entry deleted!");
          } catch (error) {
            console.error("Delete error:", error);
            Alert.alert("Error", "Failed to delete entry");
          }
        },
      },
    ]);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#111" />
        </View>
      </SafeAreaView>
    );
  }

  if (!entry) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 16 }}>
            Entry not found
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>back</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <MaterialCommunityIcons
              name={isEditing ? "close" : "pencil"}
              size={20}
              color="#111"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={{ marginLeft: 16 }}>
            <MaterialCommunityIcons name="delete" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {isEditing ? (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>title</Text>
              <TextInput
                style={styles.input}
                value={editedTitle}
                onChangeText={setEditedTitle}
                placeholderTextColor="#ccc"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>mood</Text>
              <View style={styles.moodContainer}>
                {Object.entries(moodEmojis).map(([mood, emoji]) => (
                  <TouchableOpacity
                    key={mood}
                    style={[
                      styles.moodButton,
                      editedMood === mood && styles.moodButtonSelected,
                    ]}
                    onPress={() => setEditedMood(mood)}
                  >
                    <Text style={styles.moodEmoji}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>content</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedContent}
                onChangeText={setEditedContent}
                multiline
                textAlignVertical="top"
                placeholderTextColor="#ccc"
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveEdit}
            >
              <Text style={styles.saveButtonText}>save changes</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.titleSection}>
              <Text style={styles.title}>{entry.title}</Text>
              <View style={styles.metaInfo}>
                <Text style={styles.date}>
                  {entry.createdAt.toLocaleDateString()} at{" "}
                  {entry.createdAt.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                <Text style={styles.mood}>
                  {moodEmojis[entry.mood]} {entry.mood}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.contentText}>{entry.content}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.label}>location</Text>
              <View style={styles.locationInfo}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={16}
                  color="#111"
                />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.locationName}>{entry.address}</Text>
                  <Text style={styles.coordinates}>
                    {entry.latitude.toFixed(4)}, {entry.longitude.toFixed(4)}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbfbf9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backText: {
    fontSize: 14,
    color: "#666",
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#f9e9ee",
    borderWidth: 1,
    borderColor: "#111",
    borderRadius: 8,
  },
  backButtonText: {
    fontWeight: "700",
    fontSize: 14,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  metaInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  mood: {
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 16,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "lowercase",
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
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
    height: 200,
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
  },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#f9e9ee",
    borderWidth: 1,
    borderColor: "#111",
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    fontWeight: "700",
    fontSize: 14,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  locationName: {
    fontSize: 14,
    fontWeight: "600",
  },
  coordinates: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
});
