import fetch from "node-fetch";
import config from "../../config";
import { GitEvent } from "./interfaces";

const GIT_URL = `https://api.github.com/`;
const GIT_AUTH_HEADER = `token ${config.git.token}`;

export const gitEventsApi = async (user: string): Promise<GitEvent[]> => {
    console.info(`getting git events.. for ${user}`);
    const endpoint = `${GIT_URL}users/${user}/events?per_page=${config.git.eventsPageSize}`;
    const headers = { Authorization: GIT_AUTH_HEADER };
    const response = await fetch(endpoint, { headers });
    const data = await response.json();
    return data.reverse();
};
