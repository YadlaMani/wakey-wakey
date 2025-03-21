import type { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { id, email } = req.body;
    if (!id || !email) {
      res.json({
        success: false,
        message: "id and email are required",
      });
      return;
    }
    const user = await prismaClient.user.findFirst({
      where: {
        id,
      },
    });
    if (user) {
      res.json({
        success: true,
        message: "User already exists",
        user,
      });
      return;
    }
    const newUser = await prismaClient.user.create({
      data: {
        id,
        email,
      },
    });
    res.json({
      success: true,
      message: "User created",
      user: newUser,
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
