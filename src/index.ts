import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import expressPino from "express-pino-logger";
import bodyParser from "body-parser";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logger = require("pino")();

import routes from "./routes";
import config from "./config";
import wsServer, { wsHandler } from "./ws-server";
import initStreaming from "./streaming";

const app: express.Application = express();
app.locals.name = config.app.name;
app.locals.version = config.app.version;

const ep = expressPino({
    logger,
} as expressPino.Options);
app.use(ep);
app.use(cors());
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use("/", routes);

const server = http.createServer(app);
server.on("upgrade", (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, function (ws) {
        wsServer.emit("connection", ws, request);
    });
});
wsServer.on("connection", wsHandler);

initStreaming();

server.listen(config.app.port, () => {
    logger.info(`Servidor rodando em http://${config.app.host}:${config.app.port}`);
});
