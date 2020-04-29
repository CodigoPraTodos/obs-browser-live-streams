import { Provider, StreamEvent } from "./polling";

export interface GitActor {
    id: number;
    display_login: string;
    avatar_url: string;
}

export interface GitRepo {
    id: number;
    name: string;
}

export interface GitCommit {
    message: string;
    sha: string;
}

export interface GitIssue {
    number?: number;
    title?: string;
    body?: string;
}

export interface GitPayload {
    action?: string;
    commits?: GitCommit[];
    issue?: GitIssue;
    author?: {
        name: string;
        email: string;
    };
}

export interface GitEvent {
    id: string;
    type: string;
    actor: GitActor;
    repo: GitRepo;
    payload: GitPayload;
    created_at: string;
}

// const eventToString = (event: GitEvent): string =>
//     `GIT: ${event.created_at} ${event.id} - ${event.actor.display_login} >> ${event.type} >> ${event.repo.name}`;

// const getEvents = async (user: string): Promise<GitEvent[]> => {
//     console.info(`getting git events.. for ${user}`);
//     const endpoint = `${GIT_URL}users/${user}/events?per_page=5`;
//     const headers = { Authorization: GIT_AUTH_HEADER };
//     const response = await fetch(endpoint, { headers });
//     const data: GitEvent[] = await response.json();
//     return data.reverse();
// };

// TODO: refactor verb + details, and cover more possibilities from
// https://developer.github.com/v3/activity/events/types/
const getEventTypeVerb = (type: string): string => {
    switch (type) {
        case "WatchEvent":
            return "just starred";
        case "PushEvent":
            return "pushed to";
        case "IssuesEvent":
        case "IssueCommentEvent":
            return "updated issue on";
        default:
            return type;
    }
};

const getEventDetails = (event: GitEvent): string => {
    switch (event.type) {
        case "PushEvent": {
            const { commits } = event.payload;
            if (commits && commits.length > 0) {
                return commits[commits.length - 1].message;
            }
            return "";
        }
        case "IssuesEvent":
        case "IssueCommentEvent": {
            const { issue } = event.payload;
            if (issue) {
                return `#${issue.number} - ${issue.title}`;
            }
            return "";
        }
        default:
            return "";
    }
};

export const gitEventToHtml = (event: GitEvent): string => {
    const details = getEventDetails(event);
    return `
    <span class="actor">${event.actor.display_login}</span>
    ${getEventTypeVerb(event.type)}
    <span class="object">${event.repo.name}</span><br>
    ${details ? `<small>${details}</small>` : ""}
    `;
};

export const gitEventToStream = (gitEvent: GitEvent): StreamEvent<GitEvent> => {
    const streamEvent: StreamEvent<GitEvent> = {
        id: `${gitEvent.id}`,
        html: gitEventToHtml(gitEvent),
        raw: gitEvent,
    };
    return streamEvent;
};

export const makeGitProvider = (api: () => Promise<GitEvent[]>): Provider<GitEvent> => {
    const apiFetch = async (): Promise<StreamEvent<GitEvent>[]> => {
        const events = await api();
        return events.map(gitEventToStream);
    };

    const provider: Provider<GitEvent> = {
        poll: apiFetch,
        events: [],
    };
    return provider;
};
