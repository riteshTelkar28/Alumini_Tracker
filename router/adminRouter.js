import express from 'express';
import { adminLoginController } from '../contoller/adminController.js';

var adminRouter = express.Router();

adminRouter.post("/adminLogin",adminLoginController)

export default adminRouter;