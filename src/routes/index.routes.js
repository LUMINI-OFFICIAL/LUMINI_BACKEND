import express from 'express';
import switchRouter from '@/routes/switch.routes';

const router = express.Router();

router.use('/switch', switchRouter);

export default router;