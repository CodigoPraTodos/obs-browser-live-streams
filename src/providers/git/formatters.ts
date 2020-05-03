import { GitEvent } from "./interfaces";
import { StreamEvent } from "../../events/stream-event";

export const gitEventToStream = (gitEvent: GitEvent): StreamEvent<GitEvent> => {
    const streamEvent: StreamEvent<GitEvent> = {
        id: `${gitEvent.id}`,
        html: gitEventToHtml(gitEvent),
        raw: gitEvent,
    };
    return streamEvent;
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
