import express from "express";
import { getValidator } from "../controller/validatorController";
const router = express.Router();
router.post("/", getValidator);
export default router;
