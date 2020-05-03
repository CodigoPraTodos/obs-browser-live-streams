import { AnyEvent, exampleEvent } from "./__mocks";
import { StreamEvent, makeEvent } from "./stream-event";

describe("stream events", () => {
    it("creates a StreamEvent with proper id", () => {
        const exampleHtml = `<p>${exampleEvent.text}</p>`;
        const event: StreamEvent<AnyEvent> = makeEvent(exampleEvent.id, exampleHtml, exampleEvent);
        expect(event.id).toEqual(exampleEvent.id.toString());
    });
});
