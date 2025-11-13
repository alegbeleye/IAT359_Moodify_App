import React from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AudioPlayer from "../../components/audio-player";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_TRACKS = [
  {
    id: "1",
    title: "Song 01",
    artist: "Artist01",
    duration: "01:23",
    uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "2",
    title: "Song 02",
    artist: "Artist02",
    duration: "01:23",
    uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "3",
    title: "Song 03",
    artist: "Artist03",
    duration: "01:23",
    uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    id: "4",
    title: "Song 04",
    artist: "Artist04",
    duration: "01:23",
    uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    id: "5",
    title: "Song 05",
    artist: "Artist05",
    duration: "01:23",
    uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
];

export default function PlaylistScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.headerCenter}>
          <Image source={require("../../assets/logo.png")} />
          <Text style={styles.header}>your curated{"\n"}playlist</Text>
        </View>

        <View style={styles.albumWrap}>
          <Image
            style={styles.album}
            source={{
              uri: "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=800&q=80",
            }}
          />
        </View>

        <View style={styles.playRow}>
          <View>
            <Text style={styles.playlistTitle}>Chill Vibes</Text>
            <Text style={styles.muted}>by Spotify</Text>
          </View>
        </View>

        <Text style={styles.description}>
          Serene, lowkey indie for hanging out and relaxing
        </Text>
        <Text style={styles.subMuted}>
          30-second song previews powered by Spotify
        </Text>

        <View style={styles.tagsRow}>
          <View style={styles.tagOutline}>
            <Text style={styles.tagText}>Bedroom Pop</Text>
          </View>
          <View style={[styles.tagOutline, { marginLeft: 8 }]}>
            <Text style={styles.tagText}>Acoustic</Text>
          </View>
        </View>

        {/* AUDIO PLAYER */}
        <View style={{ marginTop: 18 }}>
          <AudioPlayer tracks={MOCK_TRACKS} initialIndex={0} />
        </View>

        <View style={{ height: 1, backgroundColor: "#000", marginTop: 18 }} />
        <Text style={styles.summary}>14 Songs • 44 minutes</Text>

        <View style={{ alignItems: "center", marginTop: 28 }}>
          <View style={styles.sparkles} />
          <Text style={styles.reflect}>
            Feeling anything after{"\n"}listening?
          </Text>
          <Text style={styles.reflectSub}>
            Take a moment to write a few lines.
          </Text>
          <TouchableOpacity
            style={styles.writeBtn}
            onPress={() => navigation.navigate("Entries")}
          >
            <Text style={styles.writeBtnText}>start writing</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
            <Text style={styles.skip}>{"[skip to dashboard]"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbfbf9" },
  headerCenter: { alignItems: "center", marginBottom: 18 },
  flowerSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e9e6f6",
    marginBottom: 6,
  },
  header: { textAlign: "center", fontSize: 22, fontWeight: "600" },
  albumWrap: {
    width: 220,
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    alignSelf: "center",
  },
  album: { width: "100%", height: "100%" },
  playRow: { flexDirection: "row", alignItems: "center", marginTop: 22 },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  playlistTitle: { fontSize: 20, fontWeight: "700" },
  muted: { color: "#666", fontSize: 12 },
  description: { marginTop: 12, fontSize: 14 },
  subMuted: { color: "#777", marginTop: 6, fontSize: 12 },
  tagsRow: { flexDirection: "row", marginTop: 12 },
  tagOutline: {
    borderWidth: 1,
    borderColor: "#111",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: { fontSize: 12, fontWeight: "600" },
  summary: { marginTop: 8, fontSize: 12 },
  sparkles: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: "#fde8ef",
    marginBottom: 8,
  },
  reflect: { fontSize: 18, fontWeight: "600", textAlign: "center" },
  reflectSub: { color: "#666", textAlign: "center", marginTop: 6 },
  writeBtn: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    backgroundColor: "#f9e9ee",
    borderWidth: 1,
    borderColor: "#e2cfd4",
  },
  writeBtnText: { fontWeight: "700" },
  skip: { marginTop: 8, color: "#6b7280" },
});
