import { EventProvider, getNextEvent } from "./provider";
import { StreamEvent } from "./stream-event";

export interface StreamEventManager<T> {
    providers: EventProvider<T>[];
    lastPublishedProvider: number;
}

export const makeManager = <T>(providers: EventProvider<T>[]): StreamEventManager<T> => ({
    providers,
    lastPublishedProvider: -1,
});

export const streamNextEvent = <T>(manager: StreamEventManager<T>): StreamEvent<T> | undefined => {
    const totalProviders = manager.providers.length;

    let nextEvent: StreamEvent<T> | undefined = undefined;
    let checks = 0;
    let index = manager.lastPublishedProvider + 1;

    while (!nextEvent && checks < totalProviders) {
        index = index < totalProviders ? index : 0;
        nextEvent = getNextEvent(manager.providers[index]);
        if (nextEvent) {
            manager.lastPublishedProvider = index;
        }
        checks++;
        index++;
    }

    return nextEvent;
};
