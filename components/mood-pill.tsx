import { View, Text, Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

function MoodPill({ label, date, selected }: any) {
  return (
    <View style={[styles.pill, selected && styles.pillSelected]}>
      <Text style={[styles.pillLabel, selected && styles.pillLabelSelected]}>
        {label}
      </Text>
      <Text style={[styles.pillDate, selected && styles.pillDateSelected]}>
        {date}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    width: (width - 60) / 7 - 6,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    height: 70,
    display: "flex",
    verticalAlign: "middle",
    textAlign: "center",
    backgroundColor: "#f6f6f6",
  },
  pillSelected: { backgroundColor: "#eaf5ff", borderColor: "#9cc7ff" },
  pillLabel: { fontSize: 10, color: "#666" },
  pillLabelSelected: { color: "#1a1a1a", fontWeight: "700" },
  pillDate: { fontSize: 11, marginTop: 4 },
  pillDateSelected: { color: "#1a1a1a" },
});

export default MoodPill;
