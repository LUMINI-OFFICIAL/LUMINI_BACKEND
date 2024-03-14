import express from 'express';

const switchRouter = express.Router();

switchRouter.post('/toggle', () => {});
switchRouter.get('/', (req, res) => {
  res.send("hello");
})

export default switchRouter;