import { makeManager, streamNextEvent } from "./manager";
import { EventProvider } from "./provider";
import { AnyEvent, makeAnyEvent } from "./__mocks";

describe("stream events", () => {
    it("creates a StreamEventManager", () => {
        const manager = makeManager([]);
        expect(manager.providers).toHaveLength(0);
    });

    it("initializes the circular provider order at index -1", () => {
        const manager = makeManager([]);
        expect(manager.lastPublishedProvider).toBe(-1);
    });

    it("allows the registration of new Providers", () => {
        const anyProvider: EventProvider<AnyEvent> = {
            newEvents: [],
            pastEvents: [],
        };
        const manager = makeManager([anyProvider]);
        expect(manager.providers).toHaveLength(1);
    });

    it("retrieves the next event from the same provider", () => {
        const provider1: EventProvider<AnyEvent> = {
            newEvents: [makeAnyEvent(1), makeAnyEvent(2)],
            pastEvents: [],
        };
        const manager = makeManager([provider1]);
        expect(streamNextEvent(manager)?.id).toBe("1");
        expect(streamNextEvent(manager)?.id).toBe("2");
        expect(streamNextEvent(manager)).toBeUndefined();
    });

    it("retrieves the next event from the next provider", () => {
        const provider1: EventProvider<AnyEvent> = {
            newEvents: [makeAnyEvent(1), makeAnyEvent(2)],
            pastEvents: [],
        };

        const provider2: EventProvider<AnyEvent> = {
            newEvents: [makeAnyEvent("a"), makeAnyEvent("b")],
            pastEvents: [],
        };

        const manager = makeManager([provider1, provider2]);
        expect(streamNextEvent(manager)?.id).toBe("1");
        expect(manager.lastPublishedProvider).toBe(0);
        expect(streamNextEvent(manager)?.id).toBe("a");
        expect(manager.lastPublishedProvider).toBe(1);
        expect(streamNextEvent(manager)?.id).toBe("2");
        expect(manager.lastPublishedProvider).toBe(0);
        expect(streamNextEvent(manager)?.id).toBe("b");
        expect(manager.lastPublishedProvider).toBe(1);
        expect(streamNextEvent(manager)).toBeUndefined();
    });

    it("retrieves the next event for unbalanced providers", () => {
        const provider1: EventProvider<AnyEvent> = {
            newEvents: [makeAnyEvent(1)],
            pastEvents: [],
        };

        const provider2: EventProvider<AnyEvent> = {
            newEvents: [makeAnyEvent("a"), makeAnyEvent("b"), makeAnyEvent("c")],
            pastEvents: [],
        };

        const manager = makeManager([provider1, provider2]);
        expect(streamNextEvent(manager)?.id).toBe("1");
        expect(manager.lastPublishedProvider).toBe(0);
        expect(streamNextEvent(manager)?.id).toBe("a");
        expect(manager.lastPublishedProvider).toBe(1);
        expect(streamNextEvent(manager)?.id).toBe("b");
        expect(manager.lastPublishedProvider).toBe(1);
        expect(streamNextEvent(manager)?.id).toBe("c");
        expect(manager.lastPublishedProvider).toBe(1);
        expect(streamNextEvent(manager)).toBeUndefined();
        expect(manager.lastPublishedProvider).toBe(1);
    });

    it("retrieves the next event properly when updating the provider in the middle", () => {
        const provider1: EventProvider<AnyEvent> = {
            newEvents: [makeAnyEvent(1)],
            pastEvents: [],
        };

        const provider2: EventProvider<AnyEvent> = {
            newEvents: [makeAnyEvent("a"), makeAnyEvent("b"), makeAnyEvent("c")],
            pastEvents: [],
        };

        const manager = makeManager([provider1, provider2]);
        expect(streamNextEvent(manager)?.id).toBe("1");
        expect(manager.lastPublishedProvider).toBe(0);
        expect(streamNextEvent(manager)?.id).toBe("a");
        expect(manager.lastPublishedProvider).toBe(1);
        expect(streamNextEvent(manager)?.id).toBe("b");
        expect(manager.lastPublishedProvider).toBe(1);

        provider1.newEvents.push(makeAnyEvent(2));
        expect(streamNextEvent(manager)?.id).toBe("2");
        expect(manager.lastPublishedProvider).toBe(0);

        expect(streamNextEvent(manager)?.id).toBe("c");
        expect(manager.lastPublishedProvider).toBe(1);
        expect(streamNextEvent(manager)).toBeUndefined();
        expect(manager.lastPublishedProvider).toBe(1);
    });
});
