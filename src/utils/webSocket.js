export const webSocketCommandClient = (client) => {
  client.on('open', () => {
    console.log('WebSocket connection to server opened');
  
    // Simulate sending a message to the client after 5 seconds
    setInterval(() => {
      client.send('Hello from the server!');
      console.log('Hello');
    }, 5000);
  });
};

export const webSocketDataClient = (client) => {
  client.on('open', () => {
    console.log('WebSocket connection to server opened');
  
    // Send a message to the server
    client.send('Hello from the client!');
  });
  
  client.on('message', (message) => {
    console.log(`Received message from server: ${message}`);
  });
  
  client.on('close', () => {
    console.log('WebSocket connection to server closed');
  });
};