const net = require("net");
const fs = require("fs");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const requestString = data.toString();

    const url = requestString.split(" ")[1];
    const header = requestString.split("\r\n");
    const method = requestString.split(" ")[0];

    console.log(`url: ${url}, method: ${method}`);

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
      const filePath = process.argv[3] || "/tmp/";

      if (method === "POST") {
        const reqBody = requestString.split("\r\n")[7];
        console.log('reqbody:', reqBody)

        fs.appendFile(filePath + fileName, reqBody, (err) => {
          if (err) {
            return console.log("error", err);
          }

          socket.write('HTTP/1.1 201 Created\r\n\r\n')
        });

        // todo
      }

      if (method === "GET") {
        if (fs.existsSync(filePath + fileName)) {
          const content = fs.readFileSync(filePath + fileName).toString();
          socket.write(
            `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n${content}`
          );
        } else {
          socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
        }
      }
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
    socket.end();
  });
});

server.listen(4221, "localhost");
