import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { ThemedView } from "./themed-view";

const EntryTag = ({ contentTag }: { contentTag: string }) => {
  return (
    <ThemedView style={styles.tag}>
      <Image
        style={styles.icon}
        source={require("../assets/moods/content.png")}
      />
      <Text style={styles.tagText}>{contentTag}</Text>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  tag: {
    backgroundColor: "#f3e9b6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#000000ff",
    display: "flex",
    justifyContent: "space-evenly",
    flexDirection: "row",
    gap: 10,
    width: 120,
    alignItems: "center",
  },
  tagText: { fontSize: 12, fontWeight: "300" },
  icon: { width: 20, height: 20, marginBottom: 0 },
});

export default EntryTag;
