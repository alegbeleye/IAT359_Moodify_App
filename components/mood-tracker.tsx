import { View, StyleSheet, Text } from "react-native";
import MoodPill from "./mood-pill";
import { ThemedView } from "./themed-view";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function MoodTracker({ selectedIndex = 2 }) {
  // selectedIndex default to Wednesday
  return (
    <ThemedView>
      <Text style={styles.cardTitle}>Mood Tracker</Text>
      <View style={styles.weekRow}>
        {WEEK_DAYS.map((d, i) => (
          <MoodPill
            key={d}
            label={d.toUpperCase()}
            date={`${i + 1}`.padStart(2, "0")}
            selected={i === selectedIndex}
          />
        ))}
      </View>
      <View style={{ marginTop: 12 }}>
        <Text style={styles.streakText}>
          you're on a <Text style={{ fontWeight: "700" }}>3-day streak!</Text>{" "}
          keep it up ✋
        </Text>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  cardTitle: { fontSize: 16, fontWeight: "600" },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  streakText: { fontSize: 14, color: "#333" },
});

export default MoodTracker;
