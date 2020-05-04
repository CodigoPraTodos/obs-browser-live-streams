export interface StreamEvent<T> {
    id: string;
    html: string;
    raw: T;
}

export const makeEvent = <T>(id: string | number, html: string, raw: T): StreamEvent<T> => ({
    id: `${id}`,
    html,
    raw,
});
