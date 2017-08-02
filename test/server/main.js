//! \see https://github.com/websockets/ws#broadcast-example

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', function connection(ws) {
  console.log('connection:', ws._ultron.id);
  ws.on('message', function incoming(data) {
    console.log('message:', data);
    // Broadcast to everyone else.
    wss.clients.forEach(function each(client) {
      if (/*client !== ws && */client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});
