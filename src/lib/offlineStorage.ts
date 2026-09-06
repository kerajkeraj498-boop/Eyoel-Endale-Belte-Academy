import { useEffect, useState } from 'react';
import { NoteChapter } from '../types';

const OFFLINE_NOTES_PREFIX = 'eyoel_offline_note_';
const OFFLINE_MANIFEST_KEY = 'eyoel_offline_manifest';
const OFFLINE_SYNC_QUEUE_KEY = 'eyoel_offline_sync_queue';

export interface OfflineManifestItem {
  id: string;
  title: string;
  subjectName: string;
  grade: string;
  chapterNumber: number;
  sizeKb: number;
  savedAt: string;
}

export function saveNoteOffline(note: NoteChapter): void {
  try {
    const raw = JSON.stringify(note);
    const sizeKb = Math.round((new Blob([raw]).size) / 1024);
    localStorage.setItem(`${OFFLINE_NOTES_PREFIX}${note.id}`, raw);

    const manifest = getOfflineManifest();
    const existingIndex = manifest.findIndex((m) => m.id === note.id);
    const newItem: OfflineManifestItem = {
      id: note.id,
      title: note.title,
      subjectName: note.subjectName,
      grade: note.grade,
      chapterNumber: note.chapterNumber,
      sizeKb: Math.max(1, sizeKb),
      savedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    if (existingIndex >= 0) {
      manifest[existingIndex] = newItem;
    } else {
      manifest.push(newItem);
    }
    localStorage.setItem(OFFLINE_MANIFEST_KEY, JSON.stringify(manifest));
    window.dispatchEvent(new Event('eyoel_offline_changed'));
  } catch (err) {
    console.warn('Failed to save note offline:', err);
  }
}

export function removeNoteOffline(noteId: string): void {
  try {
    localStorage.removeItem(`${OFFLINE_NOTES_PREFIX}${noteId}`);
    const manifest = getOfflineManifest().filter((m) => m.id !== noteId);
    localStorage.setItem(OFFLINE_MANIFEST_KEY, JSON.stringify(manifest));
    window.dispatchEvent(new Event('eyoel_offline_changed'));
  } catch (err) {
    console.warn('Failed to remove offline note:', err);
  }
}

export const deleteOfflineNote = removeNoteOffline;

export function isNoteOffline(noteId: string): boolean {
  return localStorage.getItem(`${OFFLINE_NOTES_PREFIX}${noteId}`) !== null;
}

export function getOfflineNote(noteId: string): NoteChapter | null {
  try {
    const raw = localStorage.getItem(`${OFFLINE_NOTES_PREFIX}${noteId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getOfflineManifest(): OfflineManifestItem[] {
  try {
    const raw = localStorage.getItem(OFFLINE_MANIFEST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getOfflineNotes(): NoteChapter[] {
  const manifest = getOfflineManifest();
  const notes: NoteChapter[] = [];
  for (const item of manifest) {
    const note = getOfflineNote(item.id);
    if (note) notes.push(note);
  }
  return notes;
}

export function queueOfflineAction(action: { type: string; payload: any }): void {
  try {
    const queue = JSON.parse(localStorage.getItem(OFFLINE_SYNC_QUEUE_KEY) || '[]');
    queue.push({ ...action, queuedAt: Date.now() });
    localStorage.setItem(OFFLINE_SYNC_QUEUE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.warn('Failed to queue offline action:', err);
  }
}

export function getQueuedOfflineActions(): any[] {
  try {
    return JSON.parse(localStorage.getItem(OFFLINE_SYNC_QUEUE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function clearQueuedOfflineActions(): void {
  localStorage.removeItem(OFFLINE_SYNC_QUEUE_KEY);
}

// React Hook for detecting online/offline connection status & auto-syncing
export function useNetworkStatus(onReconnect?: () => void) {
  const [isOnline, setIsOnline] = useState<boolean>(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (onReconnect) {
        onReconnect();
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onReconnect]);

  return { isOnline };
}
