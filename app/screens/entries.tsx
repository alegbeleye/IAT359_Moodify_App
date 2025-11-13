import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import EntryCard from "../../components/entry-card";
import { SafeAreaView } from "react-native-safe-area-context";

const sampleEntries = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  title: "this is what is inside the entry...",
  date: "Saturday",
  dateFull: "november 1, 2025",
  mood: "🙂",
  contentTag: "content",
}));

export default function EntriesScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 20, flex: 1 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>back</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Image source={require("../../assets/logo.png")} />
          <Text style={styles.title}>all entries</Text>
        </View>

        <FlatList
          data={sampleEntries}
          keyExtractor={(i) => String(i.id)}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <EntryCard
              item={item}
              onPress={() => navigation.navigate("EntryDetail")}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbfbf9" },
  back: { color: "#111", fontSize: 14 },
  headerCenter: { alignItems: "center", marginVertical: 12 },
  flowerSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e9e6f6",
    marginBottom: 6,
  },
  title: { fontSize: 28, textTransform: "lowercase", marginTop: 6 },
});
