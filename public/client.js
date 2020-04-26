const messageContentDiv = document.getElementById("message-content");
const notificationSound = "that-was-quick.mp3";

const playSound = () => {
    const audio = new Audio(notificationSound);
    audio.play();
};

const showMessage = (message) => {
    try {
        const messageObj = JSON.parse(message);
        if (messageObj && messageObj.html) {
            messageContentDiv.innerHTML = messageObj.html;
        }
    } catch (_) {
        messageContentDiv.textContent = `${message}`;
        messageContentDiv.scrollTop = messageContentDiv.scrollHeight;
    }
    playSound();
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
        showMessage("");
        console.error("Ws Streaming error");
    };
    ws.onopen = () => {
        showMessage("");
        console.info("Ws Streamer Connected!");
    };
    ws.onclose = () => {
        showMessage("");
        console.info("Ws Streamer Closed!");
        ws = null;
    };
};

const autoConnection = () => {
    if (!ws) {
        connectWebSocket();
    }
};

setInterval(autoConnection, 1000);
