import { registerProvider, makeManager, streamNextEvent } from "./manager";
import { EventProvider } from "./provider";
import { makeSimpleEvent } from "./stream-event";

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
        const manager = makeManager([]);
        const anyProvider: EventProvider<any> = {
            newEvents: [],
            pastEvents: [],
        };
        registerProvider(manager, anyProvider);
        expect(manager.providers).toHaveLength(1);
    });

    it("retrieves the next event from the same provider", () => {
        const provider1: EventProvider<any> = {
            newEvents: [makeSimpleEvent(1), makeSimpleEvent(2)],
            pastEvents: [],
        };
        const manager = makeManager([provider1]);
        expect(streamNextEvent(manager)?.id).toBe("1");
        expect(streamNextEvent(manager)?.id).toBe("2");
        expect(streamNextEvent(manager)).toBeUndefined();
    });

    it("retrieves the next event from the next provider", () => {
        const provider1: EventProvider<any> = {
            newEvents: [makeSimpleEvent(1), makeSimpleEvent(2)],
            pastEvents: [],
        };

        const provider2: EventProvider<any> = {
            newEvents: [makeSimpleEvent("a"), makeSimpleEvent("b")],
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
        const provider1: EventProvider<any> = {
            newEvents: [makeSimpleEvent(1)],
            pastEvents: [],
        };

        const provider2: EventProvider<any> = {
            newEvents: [makeSimpleEvent("a"), makeSimpleEvent("b"), makeSimpleEvent("c")],
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
        const provider1: EventProvider<any> = {
            newEvents: [makeSimpleEvent(1)],
            pastEvents: [],
        };

        const provider2: EventProvider<any> = {
            newEvents: [makeSimpleEvent("a"), makeSimpleEvent("b"), makeSimpleEvent("c")],
            pastEvents: [],
        };

        const manager = makeManager([provider1, provider2]);
        expect(streamNextEvent(manager)?.id).toBe("1");
        expect(manager.lastPublishedProvider).toBe(0);
        expect(streamNextEvent(manager)?.id).toBe("a");
        expect(manager.lastPublishedProvider).toBe(1);
        expect(streamNextEvent(manager)?.id).toBe("b");
        expect(manager.lastPublishedProvider).toBe(1);

        provider1.newEvents.push(makeSimpleEvent(2));
        expect(streamNextEvent(manager)?.id).toBe("2");
        expect(manager.lastPublishedProvider).toBe(0);

        expect(streamNextEvent(manager)?.id).toBe("c");
        expect(manager.lastPublishedProvider).toBe(1);
        expect(streamNextEvent(manager)).toBeUndefined();
        expect(manager.lastPublishedProvider).toBe(1);
    });
});
