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

export const makeSimpleEvent = (id: string | number): StreamEvent<string | number> => ({
    id: `${id}`,
    html: `${id}`,
    raw: id,
});
