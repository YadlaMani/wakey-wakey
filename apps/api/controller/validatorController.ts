import type { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";
export const getValidator = async (req: Request, res: Response) => {
  try {
    const { publicKey, ip, location } = req.body;
    const validator = await prismaClient.validator.findFirst({
      where: {
        publicKey,
      },
      include: {
        ticks: true,
      },
    });
    if (validator) {
      res.json({
        success: true,
        message: "Validator found",
        validator,
      });
      return;
    }
    const newValidator = await prismaClient.validator.create({
      data: {
        publicKey,
        ip,
        location,
      },
      include: {
        ticks: true,
      },
    });
    res.json({
      success: true,
      message: "Validator created",
      validator: newValidator,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Internal server error",
      error: err,
    });
  }
};
