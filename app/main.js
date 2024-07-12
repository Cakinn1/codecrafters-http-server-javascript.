const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
  socket.write("HTTP/1.1 200 OK\r\n\r\n");

  socket.on('data', (d) => {
console.log(d, 'data')
  })


  socket.write("GET /index.html HTTP/1.1\r\nHost: localhost:4221\r\nUser-Agent: curl/7.64.1\r\nAccept: */*\r\n\r\n")

    socket.write("GET / HTTP/1.1")

  socket.on("close", () => {
    socket.end();
  });
});

server.listen(4221, "localhost");
