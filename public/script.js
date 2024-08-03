let canvas = document.getElementById("canvas");

canvas.width = 0.98 * window.innerWidth;
canvas.height = window.innerHeight - 150;

var socket = io.connect("http://localhost:8080/");

let context = canvas.getContext("2d");

let x;
let y;
let mousedown = false;

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
