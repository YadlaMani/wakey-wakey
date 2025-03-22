import type { Request, Response, NextFunction } from "express";
import { prismaClient } from "@repo/db/client";
export const createWebsite = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({
        message: "Unauthorized access",
        success: false,
      });
      return;
    }
    const { url } = req.body;
    if (!url) {
      res.status(400).json({
        message: "Url is required",
        success: false,
      });
      return;
    }
    const website = await prismaClient.website.create({
      data: {
        url,
        userId,
      },
    });
    console.log(website);
    res.status(200).json({
      message: "Website created successfully",
      success: true,
      data: website,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: err,
    });
  }
};
export const getWebsiteDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id);
    if (!req.userId) {
      res.status(401).json({
        message: "Unauthorized access",
        success: false,
      });
      return;
    }
    const website = await prismaClient.website.findFirst({
      where: {
        id,

        disabled: false,
      },
      include: {
        ticks: {
          include: {
            validator: true,
          },
        },
      },
    });

    if (!website) {
      res.status(404).json({
        message: "Website not found",
        success: false,
      });
      return;
    }
    res.status(200).json({
      message: "Website found",
      success: true,
      website: website,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: err,
    });
  }
};
export const getWebsites = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    console.log(userId);
    if (!userId) {
      res.status(401).json({
        message: "Unauthorized access",
        success: false,
      });
      return;
    }

    const websites = await prismaClient.website.findMany({
      where: {
        userId,
        disabled: false,
      },
      include: {
        ticks: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            validator: true,
          },
        },
      },
    });

    const formattedWebsites = websites.map((website) => ({
      ...website,
      lastValidator:
        website.ticks.length > 0 ? website.ticks[0].validator : null,
      recentTicks: website.ticks,
    }));

    res.status(200).json({
      message: "Websites found",
      success: true,
      websites: formattedWebsites,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: err,
    });
  }
};
export const deleteWebsite = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    if (!userId) {
      res.status(401).json({
        message: "Unauthorized access",
        success: false,
      });
      return;
    }
    const website = await prismaClient.website.update({
      where: {
        id,
        userId,
      },
      data: {
        disabled: true,
      },
    });
    if (!website) {
      res.status(404).json({
        message: "Website not found",
        success: false,
      });
      return;
    }
    res.status(200).json({
      message: "Website deleted successfully",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
