const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const requestString = data.toString();
    const url = requestString.split(" ")[1];

    if (url === "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    } else if (url.startsWith("/echo/")) {
      const str = url.split("/echo/")[1];
      socket.write(
        `HTTP/1.1 200 ok\r\nContent-Type: text/plain\r\nContent-Length: ${str.length}\r\n\r\n${str}`
      );
    } else if (url.startsWith("/user-agent")) {
      const content = requestString.split(" ")[5].trim();
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`
      );
    //   test
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
    socket.end();
  });
});

server.listen(4221, "localhost");
