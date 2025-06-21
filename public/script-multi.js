let canvas = document.getElementById("canvas");

canvas.width = 0.98 * window.innerWidth;
canvas.height = window.innerHeight - 150;

let context = canvas.getContext("2d");
context.strokeStyle = "#000";
context.lineWidth = 2;
context.lineCap = "round";

let x;
let y;
let mousedown = false;

// Generate unique user ID
const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
let lastPollTimestamp = Date.now();

// Check if we're running locally or on Vercel
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

let socket;
let pollingInterval;

if (isLocal && typeof io !== 'undefined') {
    // Use Socket.IO for local development
    socket = io.connect(`http://${window.location.hostname}:8080/`);
    
    canvas.onmousedown = (e) => {
        x = e.clientX - canvas.offsetLeft;
        y = e.clientY - canvas.offsetTop;
        context.moveTo(x, y);
        socket.emit("down", { x, y });
        mousedown = true;
    };

    canvas.onmouseup = (e) => {
        mousedown = false;
    };

    socket.on("ondraw", ({ x, y }) => {
        context.lineTo(x, y);
        context.stroke();
    });

    socket.on("ondown", ({ x, y }) => {
        context.moveTo(x, y);
    });

    canvas.onmousemove = (e) => {
        x = e.clientX - canvas.offsetLeft;
        y = e.clientY - canvas.offsetTop;

        if (mousedown) {
            socket.emit("draw", { x, y });
            context.lineTo(x, y);
            context.stroke();
        }
    };
} else {
    // Use API polling for Vercel deployment (multi-user support)
    let currentPath = [];

    canvas.onmousedown = (e) => {
        x = e.clientX - canvas.offsetLeft;
        y = e.clientY - canvas.offsetTop;
        context.beginPath();
        context.moveTo(x, y);
        currentPath = [{x, y}];
        sendDrawingData("down", x, y);
        mousedown = true;
    };

    canvas.onmouseup = (e) => {
        mousedown = false;
        currentPath = [];
    };

    canvas.onmousemove = (e) => {
        x = e.clientX - canvas.offsetLeft;
        y = e.clientY - canvas.offsetTop;

        if (mousedown) {
            context.lineTo(x, y);
            context.stroke();
            currentPath.push({x, y});
            sendDrawingData("draw", x, y);
        }
    };

    // API functions for multi-user collaboration
    async function sendDrawingData(type, x, y) {
        try {
            await fetch('/api/drawing', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type,
                    x,
                    y,
                    userId,
                    timestamp: Date.now()
                })
            });
        } catch (error) {
            console.error('Error sending drawing data:', error);
        }
    }

    async function pollForUpdates() {
        try {
            const response = await fetch(`/api/drawing?since=${lastPollTimestamp}&userId=${userId}`);
            const result = await response.json();
            
            if (result.actions && result.actions.length > 0) {
                // Set different color for other users' drawings
                const originalStrokeStyle = context.strokeStyle;
                context.strokeStyle = '#007bff'; // Blue for other users
                
                result.actions.forEach(action => {
                    if (action.type === "down") {
                        context.beginPath();
                        context.moveTo(action.x, action.y);
                    } else if (action.type === "draw") {
                        context.lineTo(action.x, action.y);
                        context.stroke();
                    }
                });
                
                // Restore original color
                context.strokeStyle = originalStrokeStyle;
                lastPollTimestamp = result.timestamp;
            }
        } catch (error) {
            console.error('Error polling for updates:', error);
        }
    }

    // Poll for updates every 500ms for near real-time collaboration
    pollingInterval = setInterval(pollForUpdates, 500);
}

// Add visual feedback
const statusDiv = document.createElement('div');
statusDiv.style.position = 'fixed';
statusDiv.style.top = '10px';
statusDiv.style.right = '10px';
statusDiv.style.padding = '10px';
statusDiv.style.backgroundColor = isLocal ? '#4CAF50' : '#007bff';
statusDiv.style.color = 'white';
statusDiv.style.borderRadius = '5px';
statusDiv.style.fontFamily = 'Roboto, sans-serif';
statusDiv.style.fontSize = '12px';
statusDiv.style.zIndex = '1000';
statusDiv.textContent = isLocal ? 'Local Mode (Real-time)' : 'Cloud Mode (Multi-user)';
document.body.appendChild(statusDiv);

// Add user instructions
const instructionsDiv = document.createElement('div');
instructionsDiv.style.position = 'fixed';
instructionsDiv.style.bottom = '10px';
instructionsDiv.style.left = '10px';
instructionsDiv.style.padding = '10px';
instructionsDiv.style.backgroundColor = 'rgba(0,0,0,0.8)';
instructionsDiv.style.color = 'white';
instructionsDiv.style.borderRadius = '5px';
instructionsDiv.style.fontFamily = 'Roboto, sans-serif';
instructionsDiv.style.fontSize = '12px';
instructionsDiv.style.maxWidth = '300px';
instructionsDiv.style.zIndex = '1000';
instructionsDiv.innerHTML = isLocal ? 
    '🎨 <strong>Multi-user Mode:</strong><br>Share http://localhost:8080 with others on your network!' :
    '🎨 <strong>Collaborative Whiteboard:</strong><br>Share this URL with others to draw together!<br><span style="color: #007bff;">Blue lines = Other users</span><br><span style="color: #000;">Black lines = You</span>';
document.body.appendChild(instructionsDiv);
