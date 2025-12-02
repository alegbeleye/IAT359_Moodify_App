import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { JournalEntry } from "@/services/location";

interface EntryMapProps {
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
  loved: "#ff6b9d",
  content: "#a8e6cf",
  stressed: "#ffd3b6",
  sad: "#a4b8e0",
};

export default function EntryMap({ entries, onEntryPress }: EntryMapProps) {
  const [region, setRegion] = useState({
    latitude: 49.2827,
    longitude: -123.1207,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    if (entries.length > 0) {
      calculateRegion();
    }
  }, [entries]);

  function calculateRegion() {
    if (entries.length === 0) return;

    let minLat = entries[0].latitude;
    let maxLat = entries[0].latitude;
    let minLng = entries[0].longitude;
    let maxLng = entries[0].longitude;

    entries.forEach((entry) => {
      minLat = Math.min(minLat, entry.latitude);
      maxLat = Math.max(maxLat, entry.latitude);
      minLng = Math.min(minLng, entry.longitude);
      maxLng = Math.max(maxLng, entry.longitude);
    });

    const latDelta = maxLat - minLat;
    const lngDelta = maxLng - minLng;

    const padding = 0.2;

    setRegion({
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: latDelta === 0 ? 0.0922 : latDelta + padding,
      longitudeDelta: lngDelta === 0 ? 0.0421 : lngDelta + padding,
    });
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {entries.map((entry) => {
          return (
            <Marker
              key={entry.id}
              coordinate={{
                latitude: entry.latitude,
                longitude: entry.longitude,
              }}
              pinColor={moodColors[entry.mood] || "#ccc"}
              title={entry.title}
              description={entry.address}
              onPress={() => onEntryPress(entry)}
            >
              <Callout onPress={() => onEntryPress(entry)}>
                <View style={styles.calloutBox}>
                  <View style={styles.calloutTop}>
                    <Text style={styles.calloutMood}>
                      {moodEmojis[entry.mood]}
                    </Text>
                    <Text style={styles.calloutTitle} numberOfLines={1}>
                      {entry.title}
                    </Text>
                  </View>
                  <Text style={styles.calloutDate}>
                    {entry.createdAt.toLocaleDateString()}
                  </Text>
                  <Text style={styles.calloutText} numberOfLines={2}>
                    {entry.content}
                  </Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
      <View style={styles.markerCount}>
        <Text style={styles.markerCountText}>
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbfbf9",
  },
  map: {
    flex: 1,
  },
  calloutBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    width: 240,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  calloutTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },
  calloutMood: {
    fontSize: 16,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
  },
  calloutDate: {
    fontSize: 11,
    color: "#999",
    marginBottom: 6,
  },
  calloutText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  markerCount: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  markerCountText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111",
  },
});
