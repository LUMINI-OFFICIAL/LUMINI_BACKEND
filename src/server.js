import express from 'express';
import { default as routes } from '@/routes/index.routes';
import { webSocketDataClient, webSocketCommandClient } from '@/utils/webSocket';
import http from 'http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config({ path: '.env' });

const app = express();
app.use(bodyParser.json());
app.use(cors());
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(200)
    .json({
      message: "I am alive and watching the world burn!!!"
    });
});

app.use("/api", routes);

mongoose.connect(process.env.MONGO_DB_URI, { connectTimeOutMS: 3000 })
  .catch((err) => {
    console.log(`Error connecting to mongodb: ${err}`);
  });

mongoose.connection.on("connected", () => {
  console.log("Mongodb successfully connected!!")
  server.listen(PORT, () => {
    console.log("Server is running at port " + PORT);
  });
});
