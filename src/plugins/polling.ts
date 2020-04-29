export interface StreamEvent<T> {
    id: string;
    html: string;
    raw: T;
}

export interface Provider<T> {
    poll: () => Promise<StreamEvent<T>[]>;
    events: StreamEvent<T>[];
}

export interface Polling<T> {
    provider: Provider<T>;
    refresh: () => Promise<void>;
}

export const makePolling = async <T>(provider: Provider<T>): Promise<Polling<T>> => {
    const events: StreamEvent<T>[] = await provider.poll();
    provider.events = events;

    const refresh = async (): Promise<void> => {
        const polledEvents = await provider.poll();
        const newEvents = polledEvents.filter(
            (newEvent) => provider.events.findIndex((oldEvent) => oldEvent.id === newEvent.id) < 0,
        );
        provider.events = provider.events.concat(newEvents);
    };

    const polling = {
        provider,
        refresh,
    };

    return polling;
};
