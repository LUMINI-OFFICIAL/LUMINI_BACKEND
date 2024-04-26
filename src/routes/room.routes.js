import express from 'express';
import { addRoom, getRoom, removeRoom, updateRoom } from '@/controllers/room';

const RoomRouter = express.Router();

RoomRouter.get('/', getRoom);
RoomRouter.get('/:id', getRoom)
RoomRouter.post('/', addRoom);
RoomRouter.put('/:id', updateRoom);
RoomRouter.delete('/:id', removeRoom);

export default RoomRouter;