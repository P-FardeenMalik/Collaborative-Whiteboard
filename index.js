let express = require("express");
let app = express();
let httpserver = require("http").createServer(app);
let io = require("socket.io")(httpserver);

app.use(express.static("public"));

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
    console.log(`Server is running on port  ${port}`);
});
