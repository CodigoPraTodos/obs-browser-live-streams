import { AnyEvent, exampleEvent } from "./__mocks";
import { EventProvider, fetchEvents } from "./provider";
import { makeEvent, StreamEvent } from "./stream-event";

describe("event providers", () => {
    let provider: EventProvider<AnyEvent>;
    let anyEventFetcher: () => Promise<StreamEvent<AnyEvent>[]>;

    beforeEach(() => {
        provider = {
            newEvents: [],
            pastEvents: [],
        };

        anyEventFetcher = (): Promise<StreamEvent<AnyEvent>[]> => Promise.resolve([makeEvent(1, "test", exampleEvent)]);
    });

    it("verifies that a provider has a list of new and past events", () => {
        expect(provider.newEvents).toBeDefined();
        expect(provider.pastEvents).toBeDefined();
    });

    it("fetches new events", async () => {
        await fetchEvents(provider, anyEventFetcher);
        expect(provider.newEvents.length).toBe(1);
    });

    it("should ignore repeated events to the events list object", async () => {
        await fetchEvents(provider, anyEventFetcher);
        await fetchEvents(provider, anyEventFetcher);
        expect(provider.newEvents.length).toEqual(1);
    });

    it("adds new events on repolling", async () => {
        await fetchEvents(provider, anyEventFetcher);
        await fetchEvents(provider, () => Promise.resolve([makeEvent(2, "test2", exampleEvent)]));
        expect(provider.newEvents.length).toEqual(2);
    });

    it("adds new events and ignores old events on repolling", async () => {
        await fetchEvents(provider, anyEventFetcher);
        expect(provider.newEvents.length).toEqual(1);

        await fetchEvents(provider, anyEventFetcher);
        expect(provider.newEvents.length).toEqual(1);

        await fetchEvents(provider, () => Promise.resolve([makeEvent(2, "test2", exampleEvent)]));
        expect(provider.newEvents.length).toEqual(2);

        await fetchEvents(provider, () => Promise.resolve([makeEvent(2, "test2", exampleEvent)]));
        expect(provider.newEvents.length).toEqual(2);
    });
});
