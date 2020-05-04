require("dotenv-safe").config();

const app = {
    name: "CodigoPraTodos.com - OBS Streamer",
    version: "0",
    host: process.env.APP_HOST || "",
    port: +(process.env.APP_PORT || "0"),
    environment: "development",
};

const streaming = {
    intervalMs: 5000,
};

const git = {
    token: process.env.GIT_TOKEN,
    eventsPageSize: 5,
};

const spotify = {
    token: process.env.SPOTIFY_TOKEN,
};

export default {
    app,
    git,
    spotify,
    streaming,
};
