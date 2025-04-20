// utils/localStorage.ts
import { PlaylistState } from '@/store/playlistSlice';

interface PersistedState {
  playlist: PlaylistState;
}

export const loadState = (): PersistedState | undefined => {
  // Use Partial for safety
    try {
      const serializedState = localStorage.getItem('reduxState');
      if (serializedState === null) {
        return undefined;
      }
      // Consider adding validation here instead of just parsing
      return JSON.parse(serializedState) as PersistedState; // Parse and assert type
    } catch (err) {
      console.error("Could not load state from localStorage:", err); // Add error logging
      return undefined;
    }
};