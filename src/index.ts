import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import expressPino from "express-pino-logger";
import bodyParser from "body-parser";
import WebSocket from "ws";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logger = require("pino")();

import routes from "./routes";
import config from "./config";
import fetchGitEvents from "./providers/git";
import fetchSpotifyNow from "./providers/spotify";
import { makeManager, streamNextEvent, StreamEventManager } from "./events/manager";
import { initiateProvider } from "./events/provider";
import { GitEvent } from "./providers/git/interfaces";
import { SpotifyPlayingNowEvent } from "./providers/spotify/interfaces";

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
const wss = new WebSocket.Server({ clientTracking: false, noServer: true });
const clientsMap = new Map<number, WebSocket>();
let clientsId = 0;
let streamManager: StreamEventManager<GitEvent | SpotifyPlayingNowEvent>;

server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, function (ws) {
        wss.emit("connection", ws, request);
    });
});

const startStreaming = (): void => {
    const event = streamNextEvent(streamManager);
    if (event) {
        console.info(`streaming >>> ${JSON.stringify(event.html)}`);
        clientsMap.forEach((ws) => ws.send(JSON.stringify(event)));
    }
};

const initProviders = async (): Promise<void> => {
    try {
        const gitCpt = await initiateProvider(() => fetchGitEvents("CodigoPraTodos"));
        const spotifyNow = await initiateProvider(fetchSpotifyNow);
        streamManager = makeManager<GitEvent | SpotifyPlayingNowEvent>([gitCpt, spotifyNow]);
    } catch (e) {
        console.error("Fail to initialize Providers to Stream", e);
        return process.exit(1);
    }
    setInterval(startStreaming, config.streaming.intervalMs);
};

initProviders();

wss.on("connection", (ws) => {
    const clientId = ++clientsId;
    clientsMap.set(clientId, ws);

    ws.on("message", function (message) {
        console.log(`Received message ${message} from client ${clientId}`);
    });

    ws.on("close", () => {
        clientsMap.delete(clientId);
    });
});

server.listen(config.app.port, () => {
    logger.info(`Servidor rodando em http://${config.app.host}:${config.app.port}`);
});
