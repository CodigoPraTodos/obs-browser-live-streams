import { StreamEventManager, registerProvider } from "./manager";
import { EventProvider } from "./provider";

describe("stream events", () => {
    it("creates a StreamEventManager", () => {
        const manager: StreamEventManager = { providers: [] };
        expect(manager.providers).toHaveLength(0);
    });

    it("allows the registration of new Providers", () => {
        const manager: StreamEventManager = { providers: [] };
        const anyProvider: EventProvider<any> = {
            newEvents: [],
            pastEvents: [],
        };
        registerProvider(manager, anyProvider);
        expect(manager.providers).toHaveLength(1);
    });
});
