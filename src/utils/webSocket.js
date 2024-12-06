import WebSocket from "ws";
import { makeResponse } from "./response";

const webSocketCommandClient = async (res, clientAddress) => {
  try {
    const client = new WebSocket("ws://" + clientAddress + ":82");

    await new Promise((resolve, reject) => {
      client.on('open', () => {
        console.log('WebSocket connection to server opened');
        resolve();
      });

      client.on('error', (err) => {
        console.log(err);
        reject(err);
      });
    });

    // Simulate sending a message to the client after 5 seconds
    setInterval(() => {
      client.send('Hello from the server!');
      console.log('Hello');
    }, 5000);
  } catch (err) {
    throw err;
  }
};

const webSocketDataClient = async (res, clientAddress) => {
  try {
    const client = new WebSocket("ws://" + clientAddress + ":81");

    await new Promise((resolve, reject) => {
      client.on('open', () => {
        console.log('WebSocket connection to server opened');
        // Send a message to the server
        client.send('Hello from the client!');
        resolve();
      });

      client.on('message', (message) => {
        console.log(`Received message from server: ${message}`);
      });

      client.on('close', () => {
        console.log('WebSocket connection to server closed');
        resolve();
      });

      client.on('error', (err) => {
        console.log(err);
        reject(err);
      });
    });
  } catch (err) {
    throw err;
  }
};

export const connectWS = async (req, res) => {
  const { address } = req.body;
  try {
    await Promise.all([webSocketCommandClient(res, address), webSocketDataClient(res, address)]);
    makeResponse({res, status: 200, message: 'WebSockets connected successfully'});
  } catch (err) {
    makeResponse({res, status: 500, message: err.message});
  }
};