import { AnyEvent } from "./__mocks";
import { EventProvider } from "./provider";

describe("event providers", () => {
    it("verifies that a provider has a list of new and past events", () => {
        const provider: EventProvider<AnyEvent> = {
            newEvents: [],
            pastEvents: [],
        };
        expect(provider.newEvents).toBeDefined();
        expect(provider.pastEvents).toBeDefined();
    });
});
