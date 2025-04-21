type SongInfo = {
    kind: string;
    etag: string;
    id: {
        kind: string;
        videoId: string;
    };
    snippet: {
        publishedAt: string;
        channelId: string;
        title: string;
        description: string;
        thumbnails: {
            default: {
                url: string;
                width: number;
                height: number;
            };
            medium: {
                url: string;
                width: number;
                height: number;
            };
            high: {
                url: string;
                width: number;
                height: number;
            };
        };
        channelTitle: string;
        liveBroadcastContent: string;
        publishTime: string;
    };
};

export interface Song {
    title: SongInfo["snippet"]["title"];
    thumbnail: SongInfo["snippet"]["thumbnails"]["high"];
    channelTitle: SongInfo["snippet"]["channelTitle"];
    videoId: SongInfo["id"]["videoId"];
    id?: SongInfo["id"];
    // Add other relevant song properties here (title, artist, etc.)
}

interface SongSearchResultUO {
    album: {
        albumId: string;
        name: string;
    };
    artist: {
        name: string;
        artistId: string;
    };
    duration: number;
    name: string;
    thumbnails: {
        url: string;
        width: number;
        height: number;
    }[];
    type: string;
    videoId: string;
}

export type SearchResultUnofficial = {
    albumResults: unknown;
    songResults: SongSearchResultUO[];
    playlistResults: unknown;
    artistResults: unknown;
};

export type { SongInfo, Song, SearchResultUnofficial };
