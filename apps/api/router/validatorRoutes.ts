import express from "express";
import {
  getValidator,
  withdrawAmount,
} from "../controller/validatorController";
const router = express.Router();
router.post("/", getValidator);
router.post("/withdraw", withdrawAmount);
export default router;
