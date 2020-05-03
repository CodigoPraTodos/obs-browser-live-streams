import { StreamEvent } from "./stream-event";

export interface EventProvider<T> {
    newEvents: StreamEvent<T>[];
    pastEvents: StreamEvent<T>[];
}
