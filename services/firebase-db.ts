import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { auth } from "../config/firebase";

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood: string;
  latitude: number;
  longitude: number;
  location: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

class FirebaseDbService {
  async createEntry(
    title: string,
    content: string,
    mood: string,
    latitude: number,
    longitude: number,
    location: string,
    imageUrl?: string
  ): Promise<JournalEntry> {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");

    try {
      const docRef = await addDoc(collection(db, "entries"), {
        userId,
        title,
        content,
        mood,
        latitude,
        longitude,
        location,
        imageUrl: imageUrl || null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      return {
        id: docRef.id,
        userId,
        title,
        content,
        mood,
        latitude,
        longitude,
        location,
        imageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error("Error creating entry:", error);
      throw error;
    }
  }

  async getEntries(): Promise<JournalEntry[]> {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");

    try {
      const q = query(
        collection(db, "entries"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const entries: JournalEntry[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        entries.push({
          id: doc.id,
          userId: data.userId,
          title: data.title,
          content: data.content,
          mood: data.mood,
          latitude: data.latitude,
          longitude: data.longitude,
          location: data.location,
          imageUrl: data.imageUrl,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
      });

      return entries;
    } catch (error) {
      console.error("Error getting entries:", error);
      throw error;
    }
  }

  async updateEntry(
    entryId: string,
    updates: Partial<JournalEntry>
  ): Promise<void> {
    try {
      const entryRef = doc(db, "entries", entryId);
      await updateDoc(entryRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating entry:", error);
      throw error;
    }
  }

  async deleteEntry(entryId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "entries", entryId));
    } catch (error) {
      console.error("Error deleting entry:", error);
      throw error;
    }
  }

  async getEntryById(entryId: string): Promise<JournalEntry | null> {
    try {
      const q = query(
        collection(db, "entries"),
        where("__name__", "==", entryId)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;

      const doc = querySnapshot.docs[0];
      const data = doc.data();

      return {
        id: doc.id,
        userId: data.userId,
        title: data.title,
        content: data.content,
        mood: data.mood,
        latitude: data.latitude,
        longitude: data.longitude,
        location: data.location,
        imageUrl: data.imageUrl,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    } catch (error) {
      console.error("Error getting entry:", error);
      return null;
    }
  }
}

export default new FirebaseDbService();
