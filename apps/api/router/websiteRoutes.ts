import express from "express";
import {
  createWebsite,
  getWebsites,
  getWebsiteDetails,
  toggleWebsite,
} from "../controller/websiteController";
const router = express.Router();
router.get("/", getWebsites);
router.get("/:id", getWebsiteDetails);
router.post("/create", createWebsite);
router.get("/toggle/:id", toggleWebsite);
export default router;
