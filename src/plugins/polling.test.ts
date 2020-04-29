import { makePolling, Provider, StreamEvent } from "./polling";

describe("polling tests", () => {
    let event: StreamEvent<any>;
    let event2: StreamEvent<any>;
    let provider: Provider<any>;

    beforeEach(() => {
        event = {
            id: "1",
            html: "<p>test event anything</p>",
            raw: "test event anything",
        };

        event2 = {
            id: "2",
            html: "<p>test event2 anything</p>",
            raw: "test event anything222",
        };

        provider = {
            poll: jest.fn(async () => {
                return [event];
            }),
            events: [],
        };
    });

    it("should create a polling", async () => {
        const polling = await makePolling(provider);
        expect(polling.provider).toEqual(provider);
    });

    it("should poll the provider during the initialization", async () => {
        await makePolling(provider);
        expect(provider.poll).toBeCalled();
    });

    it("should add a new event to the polling", async () => {
        const polling = await makePolling(provider);
        expect(polling.provider.events[0]).toEqual(event);
    });

    it("should ignore repeated events to the polling object", async () => {
        const polling = await makePolling(provider);
        await polling.refresh();
        await polling.refresh();
        await polling.refresh();
        expect(polling.provider.events.length).toEqual(1);
    });

    it("adds new events on repolling", async () => {
        const polling = await makePolling(provider);

        provider.poll = jest.fn(async () => {
            return [event2];
        });

        await polling.refresh();
        expect(polling.provider.events.length).toEqual(2);
    });

    it("adds new events and ignores old events on repolling", async () => {
        const polling = await makePolling(provider);

        await polling.refresh();
        expect(polling.provider.events.length).toEqual(1);

        await polling.refresh();
        expect(polling.provider.events.length).toEqual(1);

        provider.poll = jest.fn(async () => {
            return [event, event2];
        });
        await polling.refresh();
        expect(polling.provider.events.length).toEqual(2);

        await polling.refresh();
        expect(polling.provider.events.length).toEqual(2);
    });
});
