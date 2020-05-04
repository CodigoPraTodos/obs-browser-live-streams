import WebSocket from "ws";

const wss = new WebSocket.Server({ clientTracking: false, noServer: true });
let clientsId = 0;

export const clients = new Map<number, WebSocket>();

export const wsHandler = (ws: WebSocket): void => {
    const clientId = ++clientsId;
    clients.set(clientId, ws);

    ws.on("message", function (message) {
        console.log(`Received message ${message} from client ${clientId}`);
    });

    ws.on("close", () => {
        clients.delete(clientId);
    });
};

export default wss;
