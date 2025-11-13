import React from "react";
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import EntryTag from "./entry-tag";
const { width } = Dimensions.get("window");

export default function EntryCard({ item, onPress }: any) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Text style={styles.preview}>{item.title}</Text>
      <View style={styles.divider} />
      <View style={styles.footer}>
        <View>
          <Text style={styles.big}>{item.date}</Text>
          <Text style={styles.small}>{item.dateFull}</Text>
        </View>
        <EntryTag contentTag={item.contentTag} />
      </View>
    </TouchableOpacity>
  );
}

const cardWidth = (width - 60) / 2;

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    borderWidth: 1,
    borderColor: "#111",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 14,
    height: 200,
  },
  preview: {
    fontSize: 12,
    lineHeight: 16,
    margin: 10,
    height: "40%",
    borderColor: "#000000ff",
  },
  divider: { height: 1, backgroundColor: "#000000ff" },
  footer: {
    width: "100%",
    height: "35%",
    margin: 10,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  big: { fontSize: 16, fontWeight: "700" },
  small: { fontSize: 12, color: "#666" },
  icon: { width: 20, height: 20, marginBottom: 0 },
});
