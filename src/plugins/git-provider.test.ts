import { makeGitProvider, GitEvent, gitEventToHtml } from "./git-provider";

describe("polling tests", () => {
    let gitEvents: GitEvent[];
    let gitApi: () => Promise<GitEvent[]>;

    beforeEach(() => {
        gitEvents = [
            {
                actor: { id: 432523, display_login: "leordev", avatar_url: "gh.com/leo" },
                created_at: new Date().toISOString(),
                id: "1234",
                repo: { id: 124432, name: "CodigoPraTodos/obs-browser-live-streams" },
                type: "WatchEvent",
                payload: { action: "test" },
            },
        ];
        gitApi = jest.fn(async () => gitEvents);
    });

    it("creates a GitProvider", () => {
        const git = makeGitProvider(gitApi);
        expect(git.events.length).toEqual(0);
    });

    it("fetches raw portion of git events", async () => {
        const git = makeGitProvider(gitApi);
        const events = await git.poll();
        expect(events[0].raw).toEqual(gitEvents[0]);
    });

    it("fetches id portion of git events", async () => {
        const git = makeGitProvider(gitApi);
        const events = await git.poll();
        expect(events[0].id).toEqual(gitEvents[0].id);
    });

    it("fetches html portion of git events", async () => {
        const git = makeGitProvider(gitApi);
        const events = await git.poll();
        expect(events[0].html).toEqual(gitEventToHtml(gitEvents[0]));
    });
});
