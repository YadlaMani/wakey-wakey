//internals packages
import websiteRoutes from "./router/websiteRoutes";
import validatorRoutes from "./router/validatorRoutes";
import userRoutes from "./router/userRoutes";
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
app.use("/api/v1/validator", validatorRoutes);
app.use("/api/v1/user", userRoutes);
