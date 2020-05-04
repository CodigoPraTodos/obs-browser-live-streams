import fetch from "node-fetch";
import config from "../../config";
import { SpotifyPlayingNowEvent, SpotifyPlayingApi } from "./interfaces";

const SPOTIFY_URL = "https://api.spotify.com/v1/me/player/currently-playing";
const SPOTIFY_AUTH_HEADER = `Bearer ${config.spotify.token}`;

export const spotifyCurrentListeningApi = async (): Promise<SpotifyPlayingNowEvent | undefined> => {
    console.info("getting spotify listening now");
    const headers = { Authorization: SPOTIFY_AUTH_HEADER };
    const response = await fetch(SPOTIFY_URL, { headers });

    // there's no current song (no content status 204)
    if (response.status === 204) {
        return undefined;
    }

    const data: SpotifyPlayingApi = await response.json();
    return parseSpotifyEvent(data);
};

const parseSpotifyEvent = (data: SpotifyPlayingApi): SpotifyPlayingNowEvent | undefined => {
    const { item, is_playing, error } = data;
    if (error) {
        console.error(
            "Fail to get Spotify Playing Now API, please check your token or network",
            error,
        );
        throw error;
    }

    if (!is_playing || error) {
        return undefined;
    }

    const artist = item.artists.map((a) => a.name).join(", ");

    let picture = "";
    if (item.album && item.album.images && item.album.images.length) {
        picture = item.album.images[0].url;
    }

    const event = {
        id: item.id,
        title: item.name,
        artist,
        picture,
    };
    console.info(JSON.stringify(event));
    return event;
};
