import { EventProvider, getNextEvent } from "./provider";
import { StreamEvent } from "./stream-event";

export interface StreamEventManager {
    providers: EventProvider<any>[];
    lastPublishedProvider: number;
}

export const registerProvider = (
    manager: StreamEventManager,
    provider: EventProvider<any>,
): void => {
    manager.providers.push(provider);
};

export const makeManager = (providers: EventProvider<any>[]): StreamEventManager => ({
    providers,
    lastPublishedProvider: -1,
});

export const streamNextEvent = (manager: StreamEventManager): StreamEvent<any> | undefined => {
    const totalProviders = manager.providers.length;

    let nextEvent: StreamEvent<any> | undefined = undefined;
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
