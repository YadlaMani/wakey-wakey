//internals packages
import websiteRoutes from "./router/websiteRoutes";
//external packages
import express from "express";
import cors from "cors";
import { authMiddleware } from "./middleware/auth";
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5555;
app.listen(port, () => {
  console.log("Server is running on port 5555");
});
app.get("/", (req, res) => {
  res.send("Api is alive");
});
app.use("/api/v1/website", authMiddleware, websiteRoutes);
