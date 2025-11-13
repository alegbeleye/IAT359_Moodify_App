import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import PlaylistCardSmall from "../../components/playlist-card-small";
import { SafeAreaView } from "react-native-safe-area-context";
import EntryTag from "@/components/entry-tag";

export default function EntryDetailScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 20, flex: 1 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>back</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 14 }}>
          <Text style={styles.dateSmall}>Nov 01</Text>
          <Text style={styles.dateBig}>Saturday</Text>
          <Text style={styles.muted}>Today</Text>
        </View>

        <View style={{ marginTop: 16 }}>
          <EntryTag contentTag={"content"} />
        </View>

        <TextInput
          style={styles.prompt}
          placeholder="what's on your mind lately?"
        />

        <View style={{ flex: 1 }} />
        <PlaylistCardSmall onPress={() => navigation.navigate("Playlist")} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbfbf9" },
  back: { color: "#111" },
  dateSmall: { fontSize: 14, color: "#666" },
  dateBig: { fontSize: 34, fontWeight: "700" },
  muted: { color: "#666" },
  tagRow: { flexDirection: "row", alignItems: "center" },
  emoji: { fontSize: 22, marginRight: 8 },
  tag: {
    backgroundColor: "#f3e9b6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d9c87a",
  },
  tagText: { fontWeight: "700" },
  prompt: { marginTop: 22, fontSize: 14, color: "#666" },
});
