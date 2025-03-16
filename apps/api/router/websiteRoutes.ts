import express from "express";
import {
  createWebsite,
  getWebsites,
  getWebsiteStatus,
  deleteWebsite,
} from "../controller/websiteController";
const router = express.Router();
router.get("/", getWebsites);
router.get("/status/:id", getWebsiteStatus);
router.post("/create", createWebsite);
router.delete("/:id", deleteWebsite);
export default router;
