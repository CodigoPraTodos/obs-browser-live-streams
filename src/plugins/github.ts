import fetch from "node-fetch";

import config from "../config";
import { EventPublisher, Event } from "src/interfaces";

const GIT_URL = `https://api.github.com/`;
const GIT_AUTH_HEADER = `token ${config.git.token}`;

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

const eventToString = (event: GitEvent): string =>
    `GIT: ${event.created_at} ${event.id} - ${event.actor.display_login} >> ${event.type} >> ${event.repo.name}`;

const getEvents = async (user: string): Promise<GitEvent[]> => {
    console.info(`getting git events.. for ${user}`);
    const endpoint = `${GIT_URL}users/${user}/events?per_page=5`;
    const headers = { Authorization: GIT_AUTH_HEADER };
    const response = await fetch(endpoint, { headers });
    const data: GitEvent[] = await response.json();
    return data.reverse();
};

// TODO: refactor verb + details, and cover more possibilities from:
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

const eventToHtml = (event: GitEvent): string => {
    const details = getEventDetails(event);
    return `
    <span class="actor">${event.actor.display_login}</span>
    ${getEventTypeVerb(event.type)}
    <span class="object">${event.repo.name}</span><br>
    ${details ? `<small>${details}</small>` : ""}
    `;
};

const parseEvent = (event: GitEvent): Event => {
    return {
        plugin: "git",
        raw: event,
        html: eventToHtml(event),
    };
};

export class GitPolling {
    private events: GitEvent[] = [];

    constructor(private user: string, private publisher: EventPublisher) {
        this.startPoll = this.startPoll.bind(this);
        this.updateEvents = this.updateEvents.bind(this);
    }

    public async startPoll(): Promise<void> {
        const newEvents = await getEvents(this.user);
        this.updateEvents(newEvents);
        setTimeout(this.startPoll, 5000);
    }

    public publishLast(): void {
        if (this.events.length) {
            const event = parseEvent(this.events[this.events.length - 1]);
            this.publisher.publish(event);
        }
    }

    private updateEvents(newEvents: GitEvent[]): void {
        for (const newEvent of newEvents) {
            const existingEvent = this.events.find((e) => e.id === newEvent.id);
            if (!existingEvent) {
                console.info(eventToString(newEvent));
                this.events.push(newEvent);
                const event = parseEvent(newEvent);
                this.publisher.publish(event);
            }
        }
    }
}
