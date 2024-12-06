import { addRoutine, getRoutine, removeRoutine, updateRoutine } from '@/controllers/routine';
import express from 'express';

const RoutineRouter = express.Router();

RoutineRouter.get('/:id', getRoutine);
RoutineRouter.post('/', addRoutine);
RoutineRouter.put('/:id', updateRoutine);
RoutineRouter.delete('/:id', removeRoutine);

export default RoutineRouter;