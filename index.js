let express = require("express");
let app = express();

// Serve static files from public directory
app.use(express.static("public"));

// API endpoint for health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Collaborative Whiteboard API is running" });
});

// Serve the main page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// For Vercel deployment
if (process.env.NODE_ENV !== 'production') {
    let httpserver = require("http").createServer(app);
    let io = require("socket.io")(httpserver);
    
    let connections = [];

    io.on("connection", (socket) => {
        connections.push(socket);
        console.log(`Connected: ${socket.id}`);

        socket.on("draw", (data) => {
            connections.forEach(con => {
                if (con.id !== socket.id) {
                    con.emit("ondraw", { x: data.x, y: data.y });
                }
            });
        });

        socket.on("down", (data) => {
            connections.forEach(con => {
                if (con.id !== socket.id) {
                    con.emit("ondown", { x: data.x, y: data.y });
                }
            });
        });

        socket.on("disconnect", (reason) => {
            console.log(`Disconnected: ${socket.id}`);
            connections = connections.filter(con => con.id !== socket.id);
        });
    });

    let port = process.env.PORT || 8080;
    httpserver.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
} else {
    // For production (Vercel), just export the Express app
    module.exports = app;
}
