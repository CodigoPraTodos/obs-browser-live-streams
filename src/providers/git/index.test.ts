import { GitEvent } from "./interfaces";
import { gitEventToHtml } from "./formatters";
import { EventProvider, fetchEvents } from "../../events/provider";
import { StreamEvent, makeEvent } from "../../events/stream-event";

describe("git provider", () => {
    let gitProvider: EventProvider<GitEvent>;
    let gitFetcher: () => Promise<StreamEvent<GitEvent>[]>;
    let gitEvent: GitEvent;

    beforeEach(() => {
        gitEvent = {
            actor: { id: 432523, display_login: "leordev", avatar_url: "gh.com/leo" },
            created_at: new Date().toISOString(),
            id: "1234",
            repo: { id: 124432, name: "CodigoPraTodos/obs-browser-live-streams" },
            type: "WatchEvent",
            payload: { action: "test" },
        };
        gitFetcher = (): Promise<StreamEvent<GitEvent>[]> =>
            Promise.resolve([makeEvent(gitEvent.id, gitEventToHtml(gitEvent), gitEvent)]);
        gitProvider = {
            newEvents: [],
            pastEvents: [],
        };
    });

    it("fetches raw portion of git events", async () => {
        await fetchEvents(gitProvider, gitFetcher);
        expect(gitProvider.newEvents[0].raw).toEqual(gitEvent);
    });

    it("fetches id portion of git events", async () => {
        await fetchEvents(gitProvider, gitFetcher);
        expect(gitProvider.newEvents[0].id).toEqual(gitEvent.id);
    });

    it("fetches html portion of git events", async () => {
        await fetchEvents(gitProvider, gitFetcher);
        expect(gitProvider.newEvents[0].html).toEqual(gitEventToHtml(gitEvent));
    });
});
