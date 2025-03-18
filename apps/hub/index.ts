import { WebSocketServer } from "ws";
import { prismaClient } from "@repo/db/client";
import type { Validator } from "./types";
const validators: Validator[] = [];
const wss = new WebSocketServer({
  port: Number(process.env.WS_PORT) || 5050,
});
wss.on("connection", async (ws, req) => {
  try {
    const url = req.url || "";
    console.log(url);
    ws.send(JSON.stringify({ message: "Connected" }));
  } catch (err) {
    ws.send(JSON.stringify({ error: "Invalid validator id" }));
    ws.close();
  }
});
