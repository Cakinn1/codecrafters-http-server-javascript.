const net = require("net");
const fs = require("fs");
const zlib = require("zlib");

const PORT = 4221;

console.log("Server is listening to Port:", PORT);

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const requestString = data.toString();

    const url = requestString.split(" ")[1];
    const header = requestString.split("\r\n");
    const method = requestString.split(" ")[0];

    if (url === "/") {
      handleRootRequest(socket);
    } else if (url.startsWith("/echo/")) {
      handleEchoRequest(socket, url, header);
    } else if (url.startsWith("/user-agent")) {
      handleUserAgentRequest(socket, header);
    } else if (url.startsWith("/files/")) {
      handleFilesRequest(socket, url, method, header);
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
    socket.end();
  });
});

const handleRootRequest = (socket) => {
  socket.write("HTTP/1.1 200 OK\r\n\r\n");
};

const handleUserAgentRequest = (socket, header) => {
  const userAgentHeader = header.find((ele) => ele.startsWith("User-Agent: "));
  const userAgentValue = userAgentHeader.split("User-Agent:")[1].trim();
  socket.write(
    combineResponses(
      "HTTP/1.1 200 OK",
      "Content-Type: text/plain",
      `Content-Length: ${userAgentValue.length}`,
      userAgentValue
    )
  );
};

const handleFilesRequest = (socket, url, method, header) => {
  const fileName = url.split("/files/")[1];
  const filePath = process.argv[3];
  const exactFilePath = filePath + fileName;

  if (method === "POST") {
    fs.writeFileSync(exactFilePath, header[header.length - 1]);
    socket.write("HTTP/1.1 201 Created\r\n\r\n");
  } else if (method === "GET") {
    if (!fs.existsSync(exactFilePath)) {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      socket.end();
      return;
    }
    const content = fs.readFileSync(exactFilePath).toString();

    socket.write(
      combineResponses(
        "HTTP/1.1 200 OK",
        "Content-Type: application/octet-stream",
        `Content-Length: ${content.length}`,
        content
      )
    );
  }
};

const handleEchoRequest = (socket, url, header) => {
  const body = url.split("/echo/")[1];

  const acceptEncoding = header.find((ele) =>
    ele.startsWith("Accept-Encoding: ")
  );

  if (acceptEncoding) {
    const isEncodingValid = acceptEncoding
      .toLowerCase()
      .replaceAll(",", "")
      .split(" ")
      .includes("gzip");

    if (isEncodingValid) {
      const encoded = zlib.gzipSync(body);
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Encoding: gzip\r\nContent-Length: ${encoded.length}\r\n\r\n${encoded}`
      );
    } else {
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\n`);
    }
  } else {
    socket.write(
      combineResponses(
        "HTTP/1.1 200 OK",
        "Content-Type: text/plain",
        `Content-Length: ${body.length}`,
        body
      )
    );
  }
};

const combineResponses = (...args) => {
  const headers = args.slice(0, -1).join("\r\n");
  const body = args.slice(-1)[0] || "";
  return `${headers}\r\n\r\n${body}`;
};

server.listen(PORT, "localhost");
