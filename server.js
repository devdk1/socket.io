var http = require('http');
var url = require('url');
var fs = require('fs');
var io = require('socket.io');

var server = http.createServer((request, response) => {
  var path = url.parse(request.url).pathname;
  switch(path){
    case '/':
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write('hello world');
      response.end();
      break;
    case '/socket.html':
      fs.readFile(__dirname + path, (error, data) => {
          if (error){
              response.writeHead(404);
              response.write("opps this doesn't exist - 404");
              response.end();
          }
          else{
              response.writeHead(200, {"Content-Type": "text/html"});
              response.write(data, "utf8");
              response.end();
          }
      });
      break;
    default:
      response.writeHead(404);
      response.write("opps this doesn't exist - 404");
      response.end();
      break;
  }
});

server.listen(3000, () =>
  console.log('Socket server running at 3000')
);

var listener = io.listen(server);
listener.sockets.on('connection', (socket) => {
  // setInterval(() => {
    // socket.emit('date', {'date': new Date()});
  // }, 10000);
  // socket.emit('news', {dev : 'hello world'});
  socket.on('client_data', (data) => {
    process.stdout.write(data.letter);
  });
});
