import express, { Express, Request, Response } from "express";
import { getMCPData } from "../controllers/fetchingController";
const router = express.Router();

router.get('/fetching', getMCPData)

export default router;