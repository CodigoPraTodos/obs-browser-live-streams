export interface Event {
    plugin: "git" | "spotify";
    html: string;
    raw: any;
}

export interface EventPublisher {
    publish: (event: Event) => void;
}
