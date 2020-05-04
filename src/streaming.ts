import { clients } from "./ws-server";

import fetchGitEvents from "./providers/git";
import fetchSpotifyNow from "./providers/spotify";
import { makeManager, streamNextEvent, StreamEventManager } from "./events/manager";
import { initiateProvider } from "./events/provider";
import { GitEvent } from "./providers/git/interfaces";
import { SpotifyPlayingNowEvent } from "./providers/spotify/interfaces";
import config from "./config";

let streamManager: StreamEventManager<GitEvent | SpotifyPlayingNowEvent>;
const startStreaming = (): void => {
    const event = streamNextEvent(streamManager);
    if (event) {
        console.info(`streaming >>> ${JSON.stringify(event.html)}`);
        clients.forEach((ws) => ws.send(JSON.stringify(event)));
    }
};

export default async (): Promise<void> => {
    try {
        const gitCpt = await initiateProvider(() => fetchGitEvents("CodigoPraTodos"));
        const spotifyNow = await initiateProvider(fetchSpotifyNow);
        streamManager = makeManager<GitEvent | SpotifyPlayingNowEvent>([gitCpt, spotifyNow]);
    } catch (e) {
        console.error("Fail to initialize Providers to Stream", e);
        return process.exit(1);
    }
    setInterval(startStreaming, config.streaming.intervalMs);
};
