const WebSocket = require('ws');

const wsd = new WebSocket.Server({ port: 81 });
const wsc = new WebSocket.Server({ port: 82 });

wsc.on('connection', function connection(ws) {
  console.log('WebSocket connection established');

  ws.on('message', function incoming(message) {
    console.log('Received: %s', message);
  });

  ws.on('close', function close() {
    console.log('WebSocket connection closed');
  });
});

wsd.on('connection', function connection(ws) {
  console.log('WebSocket connection established');

  // Send random data to the client every second
  const interval = setInterval(() => {
    const randomNumber = Math.floor(Math.random() * 100);
    ws.send(`Random number: ${randomNumber}`);
  }, 1000);

  ws.on('close', function close() {
    console.log('WebSocket connection closed');
    clearInterval(interval); // Stop sending data when connection is closed
  });
});