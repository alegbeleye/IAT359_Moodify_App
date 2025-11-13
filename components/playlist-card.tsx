import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

function PlaylistCard() {
  return (
    <View style={styles.smallCard}>
      <View style={styles.playlistRow}>
        <View style={styles.playlistImageWrap}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=200&q=60",
            }}
            style={styles.playlistImage}
          />
        </View>
        <View style={{ flex: 1, paddingLeft: 12 }}>
          <Text style={styles.muted}>today's soundtrack</Text>
          <Text style={styles.playlistTitle}>Chill Vibes</Text>
          <Text style={styles.muted}>by Spotify</Text>
          <TouchableOpacity style={styles.listenBtn} onPress={() => {}}>
            <Text style={styles.listenText}>listen to playlist</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  smallCard: {
    borderWidth: 2,
    borderColor: "#1a1a1a",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "white",
    marginTop: 14,
  },

  playlistRow: { flexDirection: "row", alignItems: "center" },
  playlistImageWrap: {
    width: 68,
    height: 68,
    borderRadius: 8,
    overflow: "hidden",
  },
  playlistImage: { width: "100%", height: "100%" },
  muted: { color: "#666", fontSize: 12 },
  playlistTitle: { fontSize: 16, fontWeight: "700", marginTop: 4 },
  listenBtn: { marginTop: 6 },
  listenText: { textDecorationLine: "underline", fontSize: 12 },
});

export default PlaylistCard;
