const net = require("net");
const fs = require("fs");
const { Socket } = require("dgram");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");
console.log(process.argv);

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const requestString = data.toString();

    const url = requestString.split(" ")[1];
    const header = requestString.split("\r\n");

    if (url === "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    } else if (url.startsWith("/echo/")) {
      const str = url.split("/echo/")[1];
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${str.length}\r\n\r\n${str}`
      );
    } else if (url.startsWith("/user-agent")) {
      const userAgentHeader = header.find((ele) =>
        ele.startsWith("User-Agent: ")
      );
      const userAgentValue = userAgentHeader.split("User-Agent:")[1].trim();
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgentValue.length}\r\n\r\n${userAgentValue}`
      );
    } else if (url.startsWith("/files/")) {
      const fileName = url.split("/files/")[1];
      const filePath = process.argv[3];

      if (fs.existsSync(filePath + fileName)) {
        const content = fs.readFileSync(filePath + fileName).toString();

        socket.write(
          `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n${content}`
        );
      } else {
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n")
      }
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
    socket.end();
  });
});

server.listen(4221, "localhost");
