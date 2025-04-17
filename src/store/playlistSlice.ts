import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Song } from "@/types/song";
import { createSelector } from "reselect";

export interface PlaylistState {
    currentPlaylist: Song[];
    currentPlayingIndex: number | null;
    currentSongId: string | null;
    isPlaying: boolean; // New state for playing status
}

const initialState: PlaylistState = {
    currentPlaylist: [],
    currentPlayingIndex: null,
    currentSongId: null,
    isPlaying: false, // Initial playing state is false
};

export const playlistSlice = createSlice({
    name: "playlist",
    initialState,
    reducers: {
        playNow: (state, action: PayloadAction<Song>) => {
            const newSong = action.payload;
            const currSongId = state.currentSongId;
            const existingIndex = state.currentPlaylist.findIndex(
                (song) => song.videoId === newSong.videoId
            );
            if (existingIndex !== -1) {
                // song already in playlist
                state.currentPlayingIndex = existingIndex;
            } else {
                const currIndex = state.currentPlaylist.findIndex(
                    (song) => song.videoId === currSongId
                );
                state.currentPlaylist = state.currentPlaylist
                    .toSpliced(currIndex + 1, 0, newSong);
                    state.currentPlayingIndex = currIndex + 1;
            }
            state.currentSongId = newSong.videoId;
        },
        queueSong: (state, action: PayloadAction<Song>) => {
            state.currentPlaylist.push(action.payload);
            const existingIndex = state.currentPlaylist.findIndex(
                (song) => song.videoId === action.payload.videoId
            );
            if (existingIndex !== -1) {
                state.currentPlaylist.splice(existingIndex, 1);
            }
        },
        playNext: (state, action: PayloadAction<Song>) => {
            const newSong = action.payload;
            const existingIndex = state.currentPlaylist.findIndex(
                (song) => song.videoId === newSong.videoId
            );

            if (existingIndex !== -1) {
                state.currentPlayingIndex = existingIndex;
                state.currentSongId = newSong.videoId;
                state.isPlaying = true; // Start playing when playNext is called
            } else {
                state.currentPlaylist.unshift(newSong); // Add to the beginning of the queue
                state.currentPlayingIndex = 0;
                state.currentSongId = newSong.videoId;
                state.isPlaying = true; // Start playing when playNext is called
            }
        },
        changePlaylist: (state, action: PayloadAction<Song[]>) => {
            state.currentPlaylist = action.payload;
            state.currentPlayingIndex = action.payload.length > 0 ? 0 : null;
            state.currentSongId =
                action.payload.length > 0 ? action.payload[0].videoId : null;
            // state.isPlaying = action.payload.length > 0; // Start playing if the new playlist is not empty
        },
        playAtIndex: (state, action: PayloadAction<number>) => {
            if (
                action.payload >= 0 &&
                action.payload < state.currentPlaylist.length
            ) {
                state.currentPlayingIndex = action.payload;
                state.currentSongId =
                    state.currentPlaylist[action.payload].videoId;
                state.isPlaying = true;
            }
        },
        nextSong: (state) => {
            if (
                state.currentPlaylist.length > 0 &&
                state.currentPlayingIndex !== null
            ) {
                const nextIndex =
                    (state.currentPlayingIndex + 1) %
                    state.currentPlaylist.length;
                state.currentPlayingIndex = nextIndex;
                state.currentSongId = state.currentPlaylist[nextIndex].videoId;
                state.isPlaying = true;
            }
        },
        prevSong: (state) => {
            if (
                state.currentPlaylist.length > 0 &&
                state.currentPlayingIndex !== null
            ) {
                const prevIndex =
                    (state.currentPlayingIndex -
                        1 +
                        state.currentPlaylist.length) %
                    state.currentPlaylist.length;
                state.currentPlayingIndex = prevIndex;
                state.currentSongId = state.currentPlaylist[prevIndex].videoId;
                state.isPlaying = true;
            }
        },
        clearQueue: (state) => {
            state.currentPlaylist = [];
            state.currentPlayingIndex = null;
            state.currentSongId = null;
            state.isPlaying = false;
        },
        removeSongFromQueue: (state, action: PayloadAction<string>) => {
            const songIdToRemove = action.payload;
            const indexToRemove = state.currentPlaylist.findIndex(
                (song) => song.videoId === songIdToRemove
            );

            if (indexToRemove !== -1) {
                state.currentPlaylist.splice(indexToRemove, 1);
                // Adjust currentPlayingIndex if the removed song was before the currently playing one
                if (
                    state.currentPlayingIndex !== null &&
                    indexToRemove < state.currentPlayingIndex
                ) {
                    state.currentPlayingIndex -= 1;
                } else if (state.currentPlayingIndex === indexToRemove) {
                    // If the currently playing song was removed, reset it or try to play the next
                    state.currentPlayingIndex =
                        state.currentPlaylist.length > 0
                            ? Math.min(
                                  indexToRemove,
                                  state.currentPlaylist.length - 1
                              )
                            : null;
                    state.currentSongId =
                        state.currentPlayingIndex !== null
                            ? state.currentPlaylist[state.currentPlayingIndex]
                                  .videoId
                            : null;
                    state.isPlaying =
                        state.currentPlaylist.length > 0 &&
                        state.currentPlayingIndex !== null;
                }
            }
        },
        play: (state) => {
            state.isPlaying = true;
        },
        pause: (state) => {
            state.isPlaying = false;
        },
        shufflePlaylist: (state) => {
            state.currentPlaylist = state.currentPlaylist
                .map((song) => ({ song, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ song }) => song);

            // Reset the currentPlayingIndex to the first song in the shuffled playlist
            state.currentPlayingIndex =
                state.currentPlaylist.length > 0 ? 0 : null;
            state.currentSongId =
                state.currentPlayingIndex !== null
                    ? state.currentPlaylist[state.currentPlayingIndex].videoId
                    : null;
            state.isPlaying = state.currentPlayingIndex !== null;
        },
    },
});

export const {
    playNow,
    queueSong,
    playNext,
    changePlaylist,
    playAtIndex,
    nextSong,
    prevSong,
    clearQueue,
    removeSongFromQueue,
    play,
    pause,
    shufflePlaylist,
} = playlistSlice.actions;

export default playlistSlice.reducer;

// Selector functions
// export const selectCurrentPlaylist = (state: { playlist: PlaylistState }) => state.playlist.currentPlaylist;
export const selectCurrentPlayingIndex = (state: { playlist: PlaylistState }) =>
    state.playlist.currentPlayingIndex;
export const selectCurrentSongId = (state: { playlist: PlaylistState }) =>
    state.playlist.currentSongId;
export const selectIsPlaying = (state: { playlist: PlaylistState }) =>
    state.playlist.isPlaying;
export const selectCurrentPlayingSong = (state: {
    playlist: PlaylistState;
}) => {
    const currentIndex = state.playlist.currentPlayingIndex;
    return currentIndex !== null &&
        state.playlist.currentPlaylist.length > currentIndex
        ? state.playlist.currentPlaylist[currentIndex]
        : null;
};

export const selectCurrentSong = createSelector(
    (state: { playlist: PlaylistState }) => state.playlist,
    (playlist) => {
        const currentSongId = playlist.currentSongId;
        const currentSong = playlist.currentPlaylist.find(
            (song) => song.videoId === currentSongId
        );
        return currentSong;
    }
);

export const selectCurrentPlaylist = createSelector(
    (state: { playlist: PlaylistState }) => state.playlist,
    (playList) => playList.currentPlaylist
);
