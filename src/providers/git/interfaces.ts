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
