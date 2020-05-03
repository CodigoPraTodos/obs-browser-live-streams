import { StreamEvent } from "./stream-event";

export interface EventProvider<T> {
    newEvents: StreamEvent<T>[];
    pastEvents: StreamEvent<T>[];
}

export const fetchEvents = async <T>(
    provider: EventProvider<T>,
    fetcher: () => Promise<StreamEvent<T>[]>,
): Promise<void> => {
    const events = await fetcher();
    const newEvents = filterNewEvents(provider, events);
    provider.newEvents = provider.newEvents.concat(newEvents);
    return Promise.resolve();
};

const filterNewEvents = <T>(
    provider: EventProvider<T>,
    events: StreamEvent<T>[],
): StreamEvent<T>[] => {
    const existingEvents = provider.newEvents.concat(provider.pastEvents);
    const newEvents = events.filter(
        (event) => !existingEvents.find((currentEvent) => currentEvent.id === event.id),
    );
    return newEvents;
};

export const initiateProvider = async <T>(
    fetcher: () => Promise<StreamEvent<T>[]>,
): Promise<EventProvider<T>> => {
    const provider: EventProvider<T> = {
        newEvents: [],
        pastEvents: [],
    };
    await fetchEvents(provider, fetcher);
    setInterval(async () => await fetchEvents(provider, fetcher), 5000);
    return provider;
};
