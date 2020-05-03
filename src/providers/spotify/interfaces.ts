export interface SpotifyPlayingNowEvent {
    id: string;
    artist: string;
    title: string;
    picture: string;
}

export interface SpotifyPlayingApi {
    error: any;
    is_playing: boolean;
    item: {
        id: string;
        name: string;
        album: {
            images: {
                url: string;
            }[];
        };
        artists: {
            name: string;
        }[];
    };
}
