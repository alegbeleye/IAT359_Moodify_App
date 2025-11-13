import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";

function fmtTime(ms: number) {
  if (!ms) return "00:00";
  const total = Math.floor(ms / 1000);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

/**
 * AudioPlayer props:
 *  - tracks: [{ id, title, artist, uri }]
 *  - initialIndex: number
 */
export default function AudioPlayer({
  tracks = [],
  initialIndex = 0,
  onAddToLibrary,
}: any) {
  const soundRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [status, setStatus] = useState({
    isLoaded: false,
    isPlaying: false,
    positionMillis: 0,
    durationMillis: 0,
    volume: 1,
  });

  // load the initial track
  useEffect(() => {
    loadAndPlay(currentIndex, false);
    return () => {
      // cleanup
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current.setOnPlaybackStatusUpdate(null);
        soundRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadAndPlay(index: any, autoplay = true) {
    try {
      // unload previous
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current.setOnPlaybackStatusUpdate(null);
        soundRef.current = null;
      }

      const { uri } = tracks[index];
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: autoplay, volume: status.volume },
        onPlaybackStatus
      );
      soundRef.current = sound;
      setCurrentIndex(index);
      // the onPlaybackStatus callback will update more info
      setStatus((s) => ({
        ...s,
        isLoaded: true,
        isPlaying: autoplay,
        positionMillis: 0,
        durationMillis: 0,
      }));
    } catch (err) {
      console.warn("Failed to load audio", err);
    }
  }

  function onPlaybackStatus(playbackStatus: any) {
    if (!playbackStatus) return;
    setStatus((s) => ({
      ...s,
      isLoaded: playbackStatus.isLoaded,
      isPlaying: playbackStatus.isPlaying,
      positionMillis: playbackStatus.positionMillis ?? 0,
      durationMillis: playbackStatus.durationMillis ?? 0,
    }));

    // auto play next when finished
    if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
      handleNext();
    }
  }

  async function handlePlayPause() {
    if (!soundRef.current) return;
    const current = await soundRef.current.getStatusAsync();
    if (!current.isLoaded) return;
    if (current.isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
  }

  async function handleSeek(value: number) {
    if (!soundRef.current) return;
    try {
      const seekMillis = Math.floor(value * status.durationMillis);
      await soundRef.current.setPositionAsync(seekMillis);
    } catch (err) {
      console.warn("seek failed", err);
    }
  }

  async function handleVolumeChange(v: number) {
    if (!soundRef.current) {
      setStatus((s) => ({ ...s, volume: v }));
      return;
    }
    await soundRef.current.setVolumeAsync(v);
    setStatus((s) => ({ ...s, volume: v }));
  }

  async function handleNext() {
    const next = (currentIndex + 1) % tracks.length;
    await loadAndPlay(next, true);
  }

  async function handlePrev() {
    const prev = (currentIndex - 1 + tracks.length) % tracks.length;
    await loadAndPlay(prev, true);
  }

  async function selectTrack(index: number) {
    if (index === currentIndex) {
      // toggle play/pause
      handlePlayPause();
    } else {
      await loadAndPlay(index, true);
    }
  }

  const currentTrack = tracks[currentIndex] || {};
  const progress =
    status.durationMillis > 0
      ? status.positionMillis / status.durationMillis
      : 0;

  return (
    <View style={styles.container}>
      <View style={styles.nowRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.songTitle}>{currentTrack.title ?? "-"}</Text>
          <Text style={styles.songArtist}>{currentTrack.artist ?? "-"}</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity onPress={handlePlayPause} style={styles.playBtn}>
            <Text style={styles.playText}>{status.isPlaying ? "◼︎" : "▶"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sliderRow}>
        <Text style={styles.time}>{fmtTime(status.positionMillis)}</Text>
        <Slider
          style={styles.slider}
          value={progress}
          minimumValue={0}
          maximumValue={1}
          onSlidingComplete={handleSeek}
          minimumTrackTintColor="#111"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#111"
        />
        <Text style={styles.time}>{fmtTime(status.durationMillis)}</Text>
      </View>

      <View style={styles.volumeRow}>
        <Text style={styles.volLabel}>Vol</Text>
        <Slider
          style={{ flex: 1 }}
          minimumValue={0}
          maximumValue={1}
          value={status.volume}
          onValueChange={handleVolumeChange}
          minimumTrackTintColor="#111"
          maximumTrackTintColor="#ddd"
        />
      </View>

      {/* simple track list */}
      <View style={{ marginTop: 10 }}>
        {tracks.map((t: any, i: number) => {
          const active = i === currentIndex;
          return (
            <TouchableOpacity
              key={t.id}
              style={[styles.trackRow, active && styles.trackActive]}
              onPress={() => selectTrack(i)}
              activeOpacity={0.8}
            >
              <View>
                <Text style={styles.trackTitle}>{t.title}</Text>
                <Text style={styles.trackArtist}>{t.artist}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.trackDuration}>{t.duration}</Text>
                {active && (
                  <Text style={styles.playingTag}>
                    {status.isPlaying ? "Playing" : "Paused"}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    backgroundColor: "#fff",
    margin: 0,
  },
  nowRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  songTitle: { fontSize: 16, fontWeight: "700" },
  songArtist: { fontSize: 12, color: "#666" },
  controls: { flexDirection: "row", alignItems: "center" },
  ctrlBtn: { padding: 8 },
  ctrlText: { fontSize: 16 },
  playBtn: {
    marginHorizontal: 6,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  playText: { fontSize: 18 },
  sliderRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  slider: { flex: 1, marginHorizontal: 8 },
  time: { fontSize: 12, width: 40, textAlign: "center" },
  volumeRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  volLabel: { width: 36, fontSize: 12 },
  trackRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  trackActive: { backgroundColor: "#f7f9f9" },
  trackTitle: { fontSize: 14, fontWeight: "600" },
  trackArtist: { fontSize: 12, color: "#666" },
  trackDuration: { fontSize: 12 },
  playingTag: { fontSize: 11, color: "#1a7f1a", marginTop: 6 },
});
