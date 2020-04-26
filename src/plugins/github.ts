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

export interface GitPayload {
    action: string;
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
    `${event.created_at} ${event.id} - ${event.actor.display_login} >> ${event.type} >> ${event.repo.name}`;

const getEvents = async (user: string): Promise<GitEvent[]> => {
    console.info(`getting git events.. for ${user}`);
    const endpoint = `${GIT_URL}users/${user}/events?per_page=5`;
    const headers = { Authorization: GIT_AUTH_HEADER };
    const response = await fetch(endpoint, { headers });
    const data: GitEvent[] = await response.json();
    return data.reverse();
};

export class GitPoller {
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

    private updateEvents(newEvents: GitEvent[]): void {
        for (const newEvent of newEvents) {
            const existingEvent = this.events.find((e) => e.id === newEvent.id);
            if (!existingEvent) {
                console.info(eventToString(newEvent));
                this.events.push(newEvent);
                const event = this.parseEvent(newEvent);
                this.publisher.publish(event);
            }
        }
    }

    private parseEvent(event: GitEvent): Event {
        return {
            plugin: "git",
            raw: event,
            html: eventToString(event),
        };
    }
}
