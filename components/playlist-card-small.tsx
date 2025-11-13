import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import { ThemedView } from "./themed-view";

export default function PlaylistCardSmall({ onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <ThemedView style={styles.row}>
        <View style={styles.imageWrap}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=800&q=60",
            }}
            style={styles.image}
          />
        </View>
        <View style={{ flex: 1, paddingLeft: 12 }}>
          <Text style={styles.muted}>entry's soundtrack</Text>
          <Text style={styles.title}>Chill Vibes</Text>
          <Text style={styles.muted}>by Spotify</Text>
          <Text style={styles.listen}>listen to playlist</Text>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderColor: "#111",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
  },
  row: { flexDirection: "row", alignItems: "center" },
  imageWrap: { width: 84, height: 84, borderRadius: 12, overflow: "hidden" },
  image: { width: "100%", height: "100%" },
  muted: { color: "#666", fontSize: 12 },
  title: { fontSize: 16, fontWeight: "700", marginTop: 4 },
  listen: { marginTop: 6, textDecorationLine: "underline", fontSize: 12 },
});
