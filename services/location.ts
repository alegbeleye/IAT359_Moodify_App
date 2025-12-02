import * as Location from "expo-location";
import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood: string;
  latitude: number;
  longitude: number;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

class LocationService {
  async requestLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Location permission error:", error);
      return false;
    }
  }

  async getCurrentLocation(): Promise<LocationData | null> {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        throw new Error("Location permission denied");
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const address = await this.getAddressFromCoordinates(
        location.coords.latitude,
        location.coords.longitude
      );

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address,
      };
    } catch (error) {
      console.error("Get current location error:", error);
      return null;
    }
  }

  async getAddressFromCoordinates(
    latitude: number,
    longitude: number
  ): Promise<string> {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses.length > 0) {
        const address = addresses[0];
        return `${address.city}, ${address.region}` || "Unknown Location";
      }

      return "Unknown Location";
    } catch (error) {
      console.error("Reverse geocode error:", error);
      return "Unknown Location";
    }
  }

  async createJournalEntry(
    userId: string,
    title: string,
    content: string,
    mood: string,
    locationData: LocationData
  ): Promise<JournalEntry> {
    try {
      const docRef = await addDoc(collection(db, "journal_entries"), {
        userId,
        title,
        content,
        mood,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        address: locationData.address,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return {
        id: docRef.id,
        userId,
        title,
        content,
        mood,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        address: locationData.address,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error("Create journal entry error:", error);
      throw error;
    }
  }

  async getUserJournalEntries(userId: string): Promise<JournalEntry[]> {
    try {
      const q = query(
        collection(db, "journal_entries"),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
          } as JournalEntry)
      );
    } catch (error) {
      console.error("Get journal entries error:", error);
      return [];
    }
  }

  async updateJournalEntry(
    entryId: string,
    updates: Partial<JournalEntry>
  ): Promise<void> {
    try {
      await updateDoc(doc(db, "journal_entries", entryId), {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Update journal entry error:", error);
      throw error;
    }
  }

  async deleteJournalEntry(entryId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "journal_entries", entryId));
    } catch (error) {
      console.error("Delete journal entry error:", error);
      throw error;
    }
  }
}

export default new LocationService();
