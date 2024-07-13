const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const requestString = data.toString();
    const requestTarget = requestString.split(" ")[1];

    const okHTTPResponse = "HTTP/1.1 200 OK\r\n\r\n";
    const notFoundHTTPResponse = "HTTP/1.1 404 Not Found\r\n\r\n";
    console.log(requestTarget.split("/"), requestString);

    const echoResponse = requestTarget.split("/")[1];
    const echoStrResponse = requestTarget.split("/")[2]

    if (echoResponse === "echo") {
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${echoStrResponse.length}\r\n\r\n${echoStrResponse}`
      );
    } else if (requestTarget === "/") {
      socket.write(okHTTPResponse);
      console.log("ok");
    } else {
      socket.write(notFoundHTTPResponse);
      console.log("404");
    }
    socket.end();
  });
});

server.listen(4221, "localhost");
