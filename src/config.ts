require("dotenv-safe").config();

const app = {
    name: "CodigoPraTodos.com - Api ANS IGR",
    version: "0",
    host: process.env.APP_HOST || "",
    port: +(process.env.APP_PORT || "0"),
    environment: "development",
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
};
