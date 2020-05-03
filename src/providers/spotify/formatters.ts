import { StreamEvent } from "../../events/stream-event";
import { SpotifyPlayingNowEvent } from "./interfaces";

export const spotifyEventToStream = (
    event: SpotifyPlayingNowEvent,
): StreamEvent<SpotifyPlayingNowEvent> => {
    const streamEvent: StreamEvent<SpotifyPlayingNowEvent> = {
        id: event.id,
        html: eventToHtml(event),
        raw: event,
    };
    return streamEvent;
};

export const eventToHtml = (event: SpotifyPlayingNowEvent): string => {
    const image = event.picture ? `<img src="${event.picture}" class="thumbnail" />` : "";
    return `
    ${image}
    Playing <span class="actor">${event.title}</span>
    <br>
    <small>${event.artist}</small>
    `;
};
