import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "@/context/auth-context";
import locationService, { JournalEntry } from "@/services/location";

const moodEmojis: Record<string, string> = {
  loved: "❤️",
  content: "😊",
  stressed: "😰",
  sad: "😢",
};

function DashboardScreen({ navigation }: any) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [user])
  );

  useEffect(() => {
    loadEntries();
  }, [user]);

  async function loadEntries() {
    if (!user) return;

    try {
      setLoading(true);
      const userEntries = await locationService.getUserJournalEntries(user.id);
      setEntries(userEntries);
    } catch (error) {
      console.error("Failed to load entries:", error);
      Alert.alert("Error", "Failed to load entries");
    } finally {
      setLoading(false);
    }
  }

  function getMoodStats() {
    const stats: Record<string, number> = {
      loved: 0,
      content: 0,
      stressed: 0,
      sad: 0,
    };

    entries.forEach((entry) => {
      stats[entry.mood]++;
    });

    return stats;
  }

  function getRecentEntries() {
    return entries
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);
  }

  const moodStats = getMoodStats();
  const recentEntries = getRecentEntries();

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
        <View style={styles.header}>
          <Text style={styles.greeting}>welcome back</Text>
          <Text style={styles.entryCount}>
            {entries.length} {entries.length === 1 ? "entry" : "entries"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => navigation.navigate("MoodSelect")}
        >
          <Text style={styles.createBtnText}>+ create entry</Text>
        </TouchableOpacity>

        {entries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>no entries yet</Text>
            <Text style={styles.emptySubText}>
              create your first journal entry{`\n`}to get started
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>mood distribution</Text>
              <View style={styles.statsGrid}>
                {Object.entries(moodEmojis).map(([mood, emoji]) => (
                  <View key={mood} style={styles.statCard}>
                    <Text style={styles.statEmoji}>{emoji}</Text>
                    <Text style={styles.statCount}>{moodStats[mood]}</Text>
                    <Text style={styles.statLabel}>{mood}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.recentSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>recent entries</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Entries")}
                >
                  <Text style={styles.seeAllLink}>see all</Text>
                </TouchableOpacity>
              </View>

              {recentEntries.map((entry) => (
                <TouchableOpacity
                  key={entry.id}
                  style={styles.recentCard}
                  onPress={() =>
                    navigation.navigate("EntryDetail", { entryId: entry.id })
                  }
                >
                  <View style={styles.recentCardHeader}>
                    <Text style={styles.recentTitle} numberOfLines={1}>
                      {entry.title}
                    </Text>
                    <Text style={styles.recentMood}>
                      {moodEmojis[entry.mood]}
                    </Text>
                  </View>
                  <Text style={styles.recentDate}>
                    {entry.createdAt.toLocaleDateString()} • {entry.address}
                  </Text>
                  <Text style={styles.recentContent} numberOfLines={2}>
                    {entry.content}
                  </Text>
                </TouchableOpacity>
              ))}
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
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  entryCount: {
    fontSize: 14,
    color: "#999",
  },
  createBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#f9e9ee",
    borderWidth: 1,
    borderColor: "#111",
    alignItems: "center",
    marginBottom: 20,
  },
  createBtnText: {
    fontWeight: "700",
    fontSize: 14,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
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
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  statEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  statCount: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: "#999",
    textTransform: "lowercase",
  },
  recentSection: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAllLink: {
    fontSize: 12,
    color: "#666",
    textDecorationLine: "underline",
  },
  recentCard: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  recentCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  recentMood: {
    fontSize: 18,
  },
  recentDate: {
    fontSize: 11,
    color: "#999",
    marginBottom: 6,
  },
  recentContent: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
});

export default DashboardScreen;
