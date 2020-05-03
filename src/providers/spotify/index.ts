import { StreamEvent, makeEvent } from "../../events/stream-event";
import { spotifyCurrentListeningApi } from "./api";
import { SpotifyPlayingNowEvent } from "./interfaces";
import { eventToHtml } from "./formatters";

export const fetchPlayingNow = async (): Promise<StreamEvent<SpotifyPlayingNowEvent>[]> => {
    const event = await spotifyCurrentListeningApi();
    if (event) {
        const streamEvent = makeEvent(event.id, eventToHtml(event), event);
        return [streamEvent];
    }
    return [];
};

export default fetchPlayingNow;
