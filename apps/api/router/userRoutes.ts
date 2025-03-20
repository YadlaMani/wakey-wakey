import express from "express";
import { registerUser } from "../controller/userController";
const router = express.Router();
router.post("/", registerUser);
export default router;
