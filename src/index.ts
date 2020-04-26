import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import expressPino from "express-pino-logger";
import bodyParser from "body-parser";
import WebSocket from "ws";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logger = require("pino")();

// import logger from "./logger";
import routes from "./routes";
import config from "./config";

const app: express.Application = express();
app.locals.name = config.app.name;
app.locals.version = config.app.version;

const ep = expressPino({
    logger,
} as any);
app.use(ep);
app.use(cors());
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use("/", routes);

const server = http.createServer(app);
const wss = new WebSocket.Server({ clientTracking: false, noServer: true });
const clientsMap = new Map();
let clientsId = 0;

server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, function (ws) {
        wss.emit("connection", ws, request);
    });
});

wss.on("connection", (ws, _request) => {
    const clientId = ++clientsId;
    clientsMap.set(clientId, ws);

    const clientTimer = setInterval(() => {
        ws.send("test random number " + Math.round(Math.random() * 1000));
    }, 1500);

    ws.on("message", function (message) {
        console.log(`Received message ${message} from client ${clientId}`);
    });

    ws.on("close", () => {
        clearInterval(clientTimer);
        clientsMap.delete(clientId);
    });

    ws.send("welcome to the ws server, you are " + clientId);
});

server.listen(config.app.port, () => {
    logger.info(`Servidor rodando em http://${config.app.host}:${config.app.port}`);
});
