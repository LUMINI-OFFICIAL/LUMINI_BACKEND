import express from 'express';
import { default as routes } from '@/routes/index.routes';
import http from 'http';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import WebSocket from 'ws';
import { connectWS } from '@/utils/webSocket';
import { authenticateToken } from './utils/auth';
import { fetchRoomData } from './controllers/room';
import { fetchRoutineData } from './controllers/routine';

dotenv.config({ path: '.env' });

const app = express();
app.use(bodyParser.json());
app.use(cors());
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const wss = new WebSocket.Server({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  request.query = Object.fromEntries(url.searchParams);

  // Apply the authentication middleware
  authenticateToken(request, null, (err) => {
    if (err) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      ws.userId = request.user.userId;
      wss.emit('connection', ws, request);
    });
  });
});

wss.on('connection', (ws, request) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type) {
      ws.clientType = parsedMessage.type;
      console.log(`Client type set to ${ws.clientType}`);
    }
  });

  // Send periodic updates based on client type
  setInterval(async () => {
    if (ws.clientType == 'Home') {
      try {
        const rooms = await fetchRoomData(ws.userId);
        const presets = await fetchRoutineData(ws.userId);
        ws.send(JSON.stringify([ rooms, presets ]));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    } else if (ws.clientType === 'Room') {
      const detailsMessage = JSON.stringify({ update: `Details update at ${new Date().toLocaleTimeString()}` });
      ws.send(detailsMessage);
    }
  }, 5000);

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.log(`WebSocket error: ${error}`);
  });
});

app.get("/", (req, res) => {
  res.status(200)
    .json({
      message: "I am alive and watching the world burn!!!"
    });
});

app.post("/ws", connectWS);

app.use("/api", routes);

(async () => {  
  await mongoose.connect(process.env.MONGO_DB_URI).then(() => {
    console.log("UserDB successfully connected!!")
    server.listen(PORT, () => {
      console.log("Server is running at port " + PORT);
    });
  });
})();