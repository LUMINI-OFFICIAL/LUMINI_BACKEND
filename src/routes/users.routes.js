import { login, logout, registerUser } from '@/controllers/users';
import express from 'express';

const UsersRouter = express.Router();

UsersRouter.post('/register', registerUser);
UsersRouter.post('/login', login);
UsersRouter.post('/logout', logout);

export default UsersRouter;