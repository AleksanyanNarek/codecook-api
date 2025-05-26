import { Request, Response } from "express";

import { CatchAsyncError } from "../utils/catchAsyncErrors";
import { prisma } from "../utils/prisma";
import ErrorHandler from "../utils/ErrorHandler";
import { TokenPayload } from "../utils/types";

export const getCurrentUserController = CatchAsyncError(
  async (req: Request, res: Response) => {
    const tokenUser = req.tokenUser as TokenPayload;

    const user = await prisma.user.findUnique({ where: { id: tokenUser.id } });

    if (!user) {
      throw ErrorHandler.UnauthorizedError();
    }

    res.status(200).json({
      success: true,
      message: "current user data",
      data: user,
    });
  }
);