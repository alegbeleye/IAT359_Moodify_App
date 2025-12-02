import React, { useEffect, useState, useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "@/context/auth-context";
import locationService, { JournalEntry } from "@/services/location";
import EntryMap from "@/components/entry-map";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const moodEmojis: Record<string, string> = {
  loved: "❤️",
  content: "😊",
  stressed: "😰",
  sad: "😢",
};

export default function EntriesScreen({ navigation }: any) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [user])
  );

  async function loadEntries() {
    if (!user) return;

    try {
      setLoading(true);
      const userEntries = await locationService.getUserJournalEntries(user.id);
      setEntries(
        userEntries.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )
      );
      setFilteredEntries(
        userEntries.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )
      );
    } catch (error) {
      console.error("Failed to load entries:", error);
      Alert.alert("Error", "Failed to load journal entries");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(query: string) {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredEntries(entries);
    } else {
      const filtered = entries.filter(
        (entry) =>
          entry.title.toLowerCase().includes(query.toLowerCase()) ||
          entry.content.toLowerCase().includes(query.toLowerCase()) ||
          entry.address.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredEntries(filtered);
    }
  }

  async function handleDelete(entryId: string) {
    Alert.alert("Delete Entry", "Are you sure you want to delete this entry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await locationService.deleteJournalEntry(entryId);
            loadEntries();
          } catch (error) {
            Alert.alert("Error", "Failed to delete entry");
          }
        },
      },
    ]);
  }

  function handleEntryPress(entry: JournalEntry) {
    navigation.navigate("EntryDetail", {
      entryId: entry.id,
      entry: entry,
    });
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
      <View style={styles.header}>
        <Text style={styles.title}>journal entries</Text>
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={18}
            color="#999"
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search entries..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#ccc"
          />
        </View>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              viewMode === "map" && styles.toggleBtnActive,
            ]}
            onPress={() => setViewMode("map")}
          >
            <MaterialCommunityIcons
              name="map"
              size={18}
              color={viewMode === "map" ? "#fff" : "#999"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              viewMode === "list" && styles.toggleBtnActive,
            ]}
            onPress={() => setViewMode("list")}
          >
            <MaterialCommunityIcons
              name="format-list-bulleted"
              size={18}
              color={viewMode === "list" ? "#fff" : "#999"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {filteredEntries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>no entries yet</Text>
          <Text style={styles.emptySubText}>
            create your first journal entry{"\n"}from the create entry page
          </Text>
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => navigation.navigate("MoodSelect")}
          >
            <Text style={styles.createBtnText}>create entry</Text>
          </TouchableOpacity>
        </View>
      ) : viewMode === "map" ? (
        <EntryMap entries={filteredEntries} onEntryPress={handleEntryPress} />
      ) : (
        <ScrollView contentContainerStyle={styles.entriesContainer}>
          {filteredEntries.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              style={styles.entryCard}
              onPress={() => handleEntryPress(entry)}
            >
              <View style={styles.entryHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.entryTitle} numberOfLines={1}>
                    {entry.title}
                  </Text>
                  <Text style={styles.entryDate}>
                    {entry.createdAt.toLocaleDateString()} •{" "}
                    {moodEmojis[entry.mood] || "😊"}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(entry.id)}>
                  <MaterialCommunityIcons
                    name="delete"
                    size={18}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.entryContent} numberOfLines={2}>
                {entry.content}
              </Text>

              <Text style={styles.entryLocation}>📍 {entry.address}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
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
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  controlsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1.8,
    borderColor: "#111",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111",
  },
  toggleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1.8,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  toggleBtnActive: {
    borderColor: "#111",
    backgroundColor: "#111",
  },
  entriesContainer: {
    padding: 16,
    gap: 12,
  },
  entryCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  entryDate: {
    fontSize: 12,
    color: "#999",
  },
  entryContent: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
  entryLocation: {
    fontSize: 12,
    color: "#777",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  createBtn: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    backgroundColor: "#f9e9ee",
    borderWidth: 1,
    borderColor: "#e2cfd4",
  },
  createBtnText: {
    fontWeight: "700",
    fontSize: 14,
  },
});
