const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });
let animationInterval = null;

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
        const data = JSON.parse(message);
        if (data.action === "start") {
            startAnimation(ws);
        } else if (data.action === "stop") {
            stopAnimation();
        }
    });

    ws.on("close", () => {
        stopAnimation();
        console.log("Client disconnected");
    });
});

function startAnimation(ws) {
    let width = 0;
    let increasing = true;
    
    if (!animationInterval) {
        animationInterval = setInterval(() => {
            if (increasing) {
                width += 2; // Expanding
                if (width >= 100) increasing = false;
            } else {
                width -= 2; // Contracting
                if (width <= 0) increasing = true;
            }

            const opacity = Math.max(0.2, width / 100); // Adjust brightness

            ws.send(JSON.stringify({ width, opacity }));
        }, 1000 / 60); // Smooth 60 FPS
    }
}

function stopAnimation() {
    if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
    }
}
