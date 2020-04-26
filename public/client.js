const messages = document.querySelector("#message");

const showMessage = (message) => {
    try {
        const messageObj = JSON.parse(message);
        if (messageObj && messageObj.html) {
            messages.innerHTML = messageObj.html;
        }
    } catch (_) {
        messages.textContent = `${message}`;
        messages.scrollTop = messages.scrollHeight;
    }
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
