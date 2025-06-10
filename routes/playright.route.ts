import express, { Express, Request, Response } from "express";
import { main } from "../controllers/playrightController";
const router = express.Router();


router.post('/playright', main)

export default router;