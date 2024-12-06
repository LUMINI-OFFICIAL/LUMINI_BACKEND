import express from 'express';
import { addSwitch, getSwitch, removeSwitch, updateSwitch } from '@/controllers/switch';

const switchRouter = express.Router();

switchRouter.get('/:id', getSwitch);
switchRouter.post('/', addSwitch);
switchRouter.put('/:id', updateSwitch);
switchRouter.delete('/:id', removeSwitch);

export default switchRouter;