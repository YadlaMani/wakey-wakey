import express from "express";
import {
  createWebsite,
  getWebsites,
  getWebsiteDetails,
  deleteWebsite,
} from "../controller/websiteController";
const router = express.Router();
router.get("/", getWebsites);
router.get("/:id", getWebsiteDetails);
router.post("/create", createWebsite);
router.delete("/:id", deleteWebsite);
export default router;
