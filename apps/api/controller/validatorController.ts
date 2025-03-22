import type { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";
import sendBalanceToUser from "../utils/sendBalanceToUser";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";
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
export const withdrawAmount = async (req: Request, res: Response) => {
  try {
    const { validatorId } = req.body;
    const validator = await prismaClient.validator.findUnique({
      where: {
        id: validatorId,
      },
    });
    if (!validator) {
      res.json({
        message: "Validator not found",
        success: false,
      });
      return;
    }
    const toAddress = validator.publicKey;
    const amount: number = validator.pendingPayouts / LAMPORTS_PER_SOL;
    if (amount <= 0) {
      res.status(400).json({ message: "Insufficient balance", success: false });
      return;
    }
    const transactionSignature = await sendBalanceToUser(amount, toAddress);

    const transaction = {
      amount,
      signature: transactionSignature,
      timestamp: new Date(),
    };
    const updatedHistory = Array.isArray(validator.history)
      ? [...validator.history, transaction]
      : [transaction];
    await prismaClient.validator.update({
      where: {
        id: validatorId,
      },
      data: {
        pendingPayouts: 0,
        history: updatedHistory,
      },
    });
    res.json({
      success: true,
      message: `Balance of ${amount} SOL deposited successfully`,
      signauture: transactionSignature,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Internal server error",
    });
  }
};
