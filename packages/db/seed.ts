import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const userId = "user_2uOw8J5Sjt6XW8En5z526s9QmFm";

  // Create websites
  const websites = await prisma.website.createMany({
    data: [
      { id: "web_1", url: "https://example.com", userId },
      { id: "web_2", url: "https://github.com", userId },
      { id: "web_3", url: "https://prisma.io", userId },
      { id: "web_4", url: "https://stackoverflow.com", userId },
      { id: "web_5", url: "https://openai.com", userId },
    ],
    skipDuplicates: true,
  });

  // Create validators
  const validators = await prisma.validator.createMany({
    data: [
      { id: "val_1", publicKey: "pubKey1", location: "US", ip: "192.168.1.1" },
      { id: "val_2", publicKey: "pubKey2", location: "IN", ip: "192.168.1.2" },
      { id: "val_3", publicKey: "pubKey3", location: "DE", ip: "192.168.1.3" },
    ],
    skipDuplicates: true,
  });

  // Create website ticks
  const ticks = await prisma.webSiteTicks.createMany({
    data: [
      {
        id: "tick_1",
        websiteId: "web_1",
        validatorId: "val_1",

        status: "GOOD",
        latency: 120,
      },
      {
        id: "tick_2",
        websiteId: "web_1",
        validatorId: "val_2",

        status: "BAD",
        latency: 300,
      },
      {
        id: "tick_3",
        websiteId: "web_2",
        validatorId: "val_1",

        status: "GOOD",
        latency: 150,
      },
      {
        id: "tick_4",
        websiteId: "web_3",
        validatorId: "val_3",

        status: "GOOD",
        latency: 90,
      },
      {
        id: "tick_5",
        websiteId: "web_4",
        validatorId: "val_2",

        status: "BAD",
        latency: 400,
      },
      {
        id: "tick_6",
        websiteId: "web_5",
        validatorId: "val_3",

        status: "GOOD",
        latency: 80,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
