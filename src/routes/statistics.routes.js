import { getStatistic } from '@/controllers/statistic';
import express from 'express';

const StatisticRouter = express.Router();

StatisticRouter.get('/', getStatistic);

export default StatisticRouter;