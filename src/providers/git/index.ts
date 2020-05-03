import { StreamEvent, makeEvent } from "../../events/stream-event";
import { gitEventsApi } from "./api";
import { GitEvent } from "./interfaces";
import { gitEventToHtml } from "./formatters";

export const fetchGitEvents = async (user: string): Promise<StreamEvent<GitEvent>[]> => {
    const events = await gitEventsApi(user);
    const streamEvents = events.map((event) => makeEvent(event.id, gitEventToHtml(event), event));
    return streamEvents;
};

export default fetchGitEvents;
