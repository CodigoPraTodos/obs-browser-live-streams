import { StreamEvent } from "./stream-event";

export interface AnyEvent {
    id: number;
    text: string;
}

export const exampleEvent: AnyEvent = {
    id: 1234,
    text: "Hello World!",
};

export const makeAnyEvent = (id: string | number): StreamEvent<AnyEvent> => ({
    id: `${id}`,
    html: `${id}`,
    raw: { id: +id, text: `${id}` },
});
