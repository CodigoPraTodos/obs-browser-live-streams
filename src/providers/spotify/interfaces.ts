export interface SpotifyPlayingNowEvent {
    id: string;
    artist: string;
    title: string;
    picture: string;
}

export interface SpotifyPlayingApi {
    is_playing: boolean;
    item: {
        id: string;
        name: string;
        album: {
            images: Array<{
                url: string;
            }>;
        };
        artists: Array<{
            name: string;
        }>;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
}
