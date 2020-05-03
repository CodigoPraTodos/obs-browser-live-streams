import { EventProvider } from "./provider";

export interface StreamEventManager {
    providers: EventProvider<any>[];
}

export const registerProvider = (
    manager: StreamEventManager,
    provider: EventProvider<any>,
): void => {
    manager.providers.push(provider);
};

export const makeManager = (providers: EventProvider<any>[]): StreamEventManager => ({
    providers,
});
