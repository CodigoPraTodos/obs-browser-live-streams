require("dotenv-safe").config();

const app = {
    name: "CodigoPraTodos.com - OBS Streamer",
    version: "0",
    host: process.env.APP_HOST || "",
    port: +(process.env.APP_PORT || "0"),
    environment: "development",
};

const git = {
    token: process.env.GIT_TOKEN,
};

// TODO: convert to env
const logging = {
    dir: "logs",
    level: "debug",
    maxSize: "20m",
    maxFiles: "7d",
    datePattern: "YYYY-MM-DD",
};

export default {
    app,
    logging,
    git,
};
