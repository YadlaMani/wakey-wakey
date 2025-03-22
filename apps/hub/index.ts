import { WebSocketServer, WebSocket } from "ws";
import { prismaClient } from "@repo/db/client";
import type { Validator, User } from "./types";
import { sendFailureMail, sendLatencyAlertMail } from "./utils/mail";

const validators: { [id: string]: WebSocket } = {};
const websiteQueue: { websiteId: string; url: string }[] = [];

const wss = new WebSocketServer({
  port: Number(process.env.WS_PORT) || 5050,
});

async function fetchWebsiteForValidation() {
  try {
    const websites = await prismaClient.website.findMany({
      where: { disabled: false },
    });

    websiteQueue.push(
      ...websites.map((website) => ({
        websiteId: website.id,
        url: website.url,
      }))
    );

    console.log("Websites fetched for validation:", websites.length);
  } catch (err) {
    console.error("Error fetching websites for validation:", err);
  }
}

function distributeWebsites() {
  Object.entries(validators).forEach(([validatorId, ws]) => {
    if (websiteQueue.length > 0) {
      const website = websiteQueue.shift();
      if (website) {
        ws.send(
          JSON.stringify({
            type: "validate_website",
            websiteId: website.websiteId,
            url: website.url,
          })
        );
      }
    }
  });
}

setInterval(
  async () => {
    await fetchWebsiteForValidation();
    distributeWebsites();
  },
  1000 * 60 * 2
);

wss.on("connection", (ws, req) => {
  try {
    const url = req.url || "";
    const validatorId = url.split("/").pop();

    if (!validatorId) {
      ws.send(JSON.stringify({ error: "Invalid validator ID" }));
      ws.close();
      return;
    }

    validators[validatorId] = ws;
    ws.send(JSON.stringify({ message: "Connected to validator" }));

    ws.on("message", async (message) => {
      const data = JSON.parse(message.toString());

      if (data.type === "join_validator") {
        console.log(`Validator ${validatorId} joined`);
        distributeWebsites();
      } else if (data.type === "validation_result") {
        const { websiteId, status, latency } = data;
        if (status === "BAD") {
          const website = await prismaClient.website.findUnique({
            where: { id: websiteId },
          });
          if (website) {
            const user = await prismaClient.user.findUnique({
              where: { id: website.userId },
              select: { email: true },
            });
            const validator = await prismaClient.validator.findUnique({
              where: { id: validatorId },
            });
            if (user && validator) {
              sendFailureMail(user.email, website.url, validator.location);
            }
            if (latency < website.latencyAlert) {
              sendLatencyAlertMail(
                user?.email as string,
                website.url,
                latency,
                website.latencyAlert
              );
            }
          }
        }

        await prismaClient.webSiteTicks.create({
          data: {
            websiteId,
            validatorId,
            status,
            latency,
          },
        });
        await prismaClient.validator.update({
          where: { id: validatorId },
          data: {
            pendingPayouts: {
              increment: 10000,
            },
          },
        });

        console.log(
          `Validator ${validatorId} validated website ${websiteId} as ${status}`
        );

        distributeWebsites();
      } else if (data.type === "leave_validator") {
        console.log(`Validator ${validatorId} left`);
        delete validators[validatorId];
        ws.close();
      }
    });

    ws.on("close", () => {
      console.log(`Validator ${validatorId} disconnected`);
      delete validators[validatorId];
    });
  } catch (err) {
    console.error("WebSocket error:", err);
  }
});
