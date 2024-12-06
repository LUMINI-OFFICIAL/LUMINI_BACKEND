import express from 'express';
import switchRouter from '@/routes/switch.routes';
import RoomRouter from '@/routes/room.routes';
import OutletRouter from '@/routes/outlets.routes';
import UsersRouter from '@/routes/users.routes';
import RoutineRouter from '@/routes/routine.routes';
import StatisticRouter from '@/routes/statistics.routes';
import { authenticateToken } from '@/utils/auth';

const router = express.Router();

router.use('/users', UsersRouter);
router.use('/switchs',authenticateToken, switchRouter);
router.use('/outlets',authenticateToken, OutletRouter)
router.use('/room',authenticateToken, RoomRouter);
router.use('/routines',authenticateToken, RoutineRouter);
router.use('/statistics',authenticateToken, StatisticRouter);

export default router;