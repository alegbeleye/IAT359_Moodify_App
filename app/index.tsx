import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/auth-context";
import firebaseDbService, { JournalEntry } from "../services/firebase-db";
import RootLayout from "./_layout";

const App = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEntries: 0,
    moodCounts: {
      loved: 0,
      content: 0,
      stressed: 0,
      sad: 0,
    },
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const fetchedEntries = await firebaseDbService.getEntries();
      setEntries(fetchedEntries);

      const moodCounts = {
        loved: 0,
        content: 0,
        stressed: 0,
        sad: 0,
      };

      fetchedEntries.forEach((entry) => {
        moodCounts[entry.mood as keyof typeof moodCounts]++;
      });

      setStats({
        totalEntries: fetchedEntries.length,
        moodCounts,
      });
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  const getMoodColor = (mood: string): string => {
    const colors: Record<string, string> = {
      loved: "#ff6b9d",
      content: "#a8e6cf",
      stressed: "#ffd3b6",
      sad: "#a4b8e0",
    };
    return colors[mood] || "#ccc";
  };

  const getMoodEmoji = (mood: string): string => {
    const emojis: Record<string, string> = {
      loved: "❤️",
      content: "😊",
      stressed: "😰",
      sad: "😢",
    };
    return emojis[mood] || "🙂";
  };

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
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>your journal</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("mood-select")}
        >
          <Text style={styles.addButtonText}>+ new entry</Text>
        </TouchableOpacity>

        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>{stats.totalEntries}</Text>
          <Text style={styles.statsLabel}>total entries</Text>
        </View>

        <Text style={styles.sectionTitle}>mood breakdown</Text>
        <View style={styles.moodGrid}>
          {Object.entries(stats.moodCounts).map(([mood, count]) => (
            <View key={mood} style={styles.moodStat}>
              <View
                style={[
                  styles.moodStatColor,
                  { backgroundColor: getMoodColor(mood) },
                ]}
              >
                <Text style={styles.moodStatEmoji}>{getMoodEmoji(mood)}</Text>
              </View>
              <Text style={styles.moodStatCount}>{count}</Text>
              <Text style={styles.moodStatLabel}>{mood}</Text>
            </View>
          ))}
        </View>

        {entries.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>recent entries</Text>
            <View style={styles.entriesList}>
              {entries.slice(0, 5).map((entry) => (
                <TouchableOpacity
                  key={entry.id}
                  style={styles.entryItem}
                  onPress={() =>
                    navigation.navigate("screens/entry-detail-screen", {
                      entryId: entry.id,
                    })
                  }
                >
                  <View
                    style={[
                      styles.entryMoodBadge,
                      { backgroundColor: getMoodColor(entry.mood) },
                    ]}
                  >
                    <Text style={styles.entryMoodEmoji}>
                      {getMoodEmoji(entry.mood)}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.entryItemTitle} numberOfLines={1}>
                      {entry.title}
                    </Text>
                    <Text style={styles.entryItemDate}>
                      {entry.createdAt.toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.entryItemArrow}>→</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>no entries yet</Text>
            <Text style={styles.emptyStateSubtext}>
              start journaling by creating your first entry
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbfbf9",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
  },
  addButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f9e9ee",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#111",
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    fontWeight: "700",
    fontSize: 14,
  },
  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  statsNumber: {
    fontSize: 36,
    fontWeight: "700",
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    color: "#999",
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  moodGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 8,
  },
  moodStat: {
    flex: 1,
    alignItems: "center",
  },
  moodStatColor: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  moodStatEmoji: {
    fontSize: 24,
  },
  moodStatCount: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  moodStatLabel: {
    fontSize: 10,
    color: "#999",
    textTransform: "capitalize",
    textAlign: "center",
  },
  entriesList: {
    gap: 12,
  },
  entryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  entryMoodBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  entryMoodEmoji: {
    fontSize: 20,
  },
  entryItemTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  entryItemDate: {
    fontSize: 11,
    color: "#999",
  },
  entryItemArrow: {
    fontSize: 16,
    color: "#ccc",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: "#999",
  },
});

export default App;
