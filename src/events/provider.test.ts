import { AnyEvent, exampleEvent } from "./__mocks";
import { EventProvider, fetchEvents, getNextEvent } from "./provider";
import { makeEvent, StreamEvent } from "./stream-event";

describe("event providers", () => {
    let provider: EventProvider<AnyEvent>;
    let anyEventFetcher: () => Promise<StreamEvent<AnyEvent>[]>;

    beforeEach(() => {
        provider = {
            newEvents: [],
            pastEvents: [],
        };

        anyEventFetcher = (): Promise<StreamEvent<AnyEvent>[]> =>
            Promise.resolve([makeEvent(1, "test", exampleEvent)]);
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

    it("gets the next element from the new events and move to the past events", () => {
        const e1 = makeEvent(1, "test2", exampleEvent);
        const e2 = makeEvent(2, "test2", exampleEvent);
        provider = {
            newEvents: [e1, e2],
            pastEvents: [],
        };

        expect(getNextEvent(provider)).toEqual(e1);
        expect(provider.newEvents).toEqual([e2]);
        expect(provider.pastEvents).toEqual([e1]);

        expect(getNextEvent(provider)).toEqual(e2);
        expect(provider.newEvents).toEqual([]);
        expect(provider.pastEvents).toEqual([e1, e2]);
    });
});
