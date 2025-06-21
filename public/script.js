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

// Check if we're running locally or on Vercel
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

let socket;
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
    // Fallback for Vercel deployment (single-user mode)
    canvas.onmousedown = (e) => {
        x = e.clientX - canvas.offsetLeft;
        y = e.clientY - canvas.offsetTop;
        context.beginPath();
        context.moveTo(x, y);
        mousedown = true;
    };

    canvas.onmouseup = (e) => {
        mousedown = false;
        context.beginPath();
    };

    canvas.onmousemove = (e) => {
        x = e.clientX - canvas.offsetLeft;
        y = e.clientY - canvas.offsetTop;

        if (mousedown) {
            context.lineTo(x, y);
            context.stroke();
        }
    };
}

// Add some visual feedback
const statusDiv = document.createElement('div');
statusDiv.style.position = 'fixed';
statusDiv.style.top = '10px';
statusDiv.style.right = '10px';
statusDiv.style.padding = '10px';
statusDiv.style.backgroundColor = isLocal ? '#4CAF50' : '#FF9800';
statusDiv.style.color = 'white';
statusDiv.style.borderRadius = '5px';
statusDiv.style.fontFamily = 'Roboto, sans-serif';
statusDiv.style.fontSize = '12px';
statusDiv.textContent = isLocal ? 'Local Mode (Collaborative)' : 'Demo Mode (Single User)';
document.body.appendChild(statusDiv);
