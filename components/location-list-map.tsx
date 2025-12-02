import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { JournalEntry } from "@/services/location";

interface LocationListMapProps {
  entries: JournalEntry[];
  onEntryPress: (entry: JournalEntry) => void;
}

const moodEmojis: Record<string, string> = {
  loved: "❤️",
  content: "😊",
  stressed: "😰",
  sad: "😢",
};

const moodColors: Record<string, string> = {
  loved: "#ff6b6b",
  content: "#4ecdc4",
  stressed: "#ffe66d",
  sad: "#95a3d6",
};

export default function LocationListMap({
  entries,
  onEntryPress,
}: LocationListMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Group entries by location
  const locationGroups = entries.reduce((acc, entry) => {
    const key = entry.address;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(entry);
    return acc;
  }, {} as Record<string, JournalEntry[]>);

  const locations = Object.entries(locationGroups).map(
    ([address, entries]) => ({
      address,
      entries,
      count: entries.length,
    })
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.locationList}
        contentContainerStyle={styles.locationListContent}
        showsVerticalScrollIndicator={false}
      >
        {locations.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="map-search"
              size={48}
              color="#ddd"
              style={{ marginBottom: 12 }}
            />
            <Text style={styles.emptyText}>no locations yet</Text>
            <Text style={styles.emptySubText}>
              create journal entries to see them grouped by location
            </Text>
          </View>
        ) : (
          locations.map((location) => (
            <TouchableOpacity
              key={location.address}
              style={[
                styles.locationCard,
                selectedLocation === location.address &&
                  styles.locationCardSelected,
              ]}
              onPress={() => setSelectedLocation(location.address)}
            >
              <View style={styles.locationCardTop}>
                <View style={styles.locationInfo}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={20}
                    color="#111"
                  />
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={styles.locationName} numberOfLines={1}>
                      {location.address}
                    </Text>
                    <Text style={styles.locationCount}>
                      {location.count}{" "}
                      {location.count === 1 ? "entry" : "entries"}
                    </Text>
                  </View>
                </View>
                <View style={styles.moodDots}>
                  {location.entries.map((entry, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.moodDot,
                        { backgroundColor: moodColors[entry.mood] || "#ccc" },
                      ]}
                    />
                  ))}
                </View>
              </View>

              {selectedLocation === location.address && (
                <View style={styles.entriesPreview}>
                  {location.entries.map((entry) => (
                    <TouchableOpacity
                      key={entry.id}
                      style={styles.entryPreview}
                      onPress={() => onEntryPress(entry)}
                    >
                      <Text style={styles.entryMood}>
                        {moodEmojis[entry.mood]}
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.entryTitle} numberOfLines={1}>
                          {entry.title}
                        </Text>
                        <Text style={styles.entryDate}>
                          {entry.createdAt.toLocaleDateString()}
                        </Text>
                      </View>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={20}
                        color="#ccc"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbfbf9",
  },
  locationList: {
    flex: 1,
  },
  locationListContent: {
    padding: 16,
    gap: 12,
  },
  locationCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
  },
  locationCardSelected: {
    borderColor: "#111",
    backgroundColor: "#fafafa",
  },
  locationCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationName: {
    fontSize: 14,
    fontWeight: "600",
  },
  locationCount: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
  moodDots: {
    flexDirection: "row",
    gap: 4,
  },
  moodDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  entriesPreview: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 12,
    gap: 8,
  },
  entryPreview: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#fbfbf9",
    borderRadius: 6,
  },
  entryMood: {
    fontSize: 20,
    marginRight: 8,
  },
  entryTitle: {
    fontSize: 13,
    fontWeight: "600",
  },
  entryDate: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 300,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  emptySubText: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
  },
});
