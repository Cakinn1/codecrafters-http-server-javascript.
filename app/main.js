const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const requestString = data.toString();

    const requestTarget = requestString.split(" ")[1];
    console.log("request:", requestTarget, requestString);

    if (requestTarget === "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
      socket.on("close", () => {
        socket.end();
      });
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      socket.on("close", () => {
        socket.end();
      });
    }
  });
});

server.listen(4221, "localhost");
