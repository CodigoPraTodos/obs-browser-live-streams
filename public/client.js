const messages = document.querySelector("#message");

const showMessage = (message) => {
    messages.textContent = `\n${message}`;
    messages.scrollTop = messages.scrollHeight;
};

let ws;

const connectWebSocket = () => {
    console.info("loading ws...");
    if (ws) {
        ws.onerror = ws.onopen = ws.onclose = null;
        ws.close();
    }

    ws = new WebSocket(`ws://${location.host}`);
    ws.onmessage = (ev) => {
        showMessage(ev.data);
    };

    ws.onerror = () => {
        showMessage("WebSocket error");
    };
    ws.onopen = () => {
        showMessage("WebSocket connection established");
    };
    ws.onclose = () => {
        showMessage("WebSocket connection closed");
        ws = null;
    };
};
