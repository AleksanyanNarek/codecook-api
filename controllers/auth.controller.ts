import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { CatchAsyncError } from "../utils/catchAsyncErrors";
import { prisma } from "../utils/prisma";
import { generateTokens, getAccessTokenCookieOptions, getRefreshTokenCookieOptions, saveToken } from "../services/token.service";
import { loginValidation, logoutValidation, registrationValidation } from "../services/auth.service";

export const signUpController = CatchAsyncError(
  async (req: Request, res: Response) => {
    const { name, password, surename, email, phone } = await registrationValidation(req.body);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { hashedPassword, name, surename, email, phone },
    });

    const { accessToken, refreshToken } = generateTokens({ id: newUser.id, email: newUser.email, role: newUser.role });
    await saveToken(newUser.id, refreshToken);

    res.cookie('accessToken', accessToken, getAccessTokenCookieOptions());
    res.cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: newUser.id,
        role: newUser.role,
        name: newUser.name,
        surename: newUser.surename,
        email: newUser.email,
        phone: newUser.phone,
      },
    });
  }
);

export const loginController = CatchAsyncError(
  async (req: Request, res: Response) => {
    const currentUser = await loginValidation(req.body);

    const { accessToken, refreshToken } = generateTokens({ id: currentUser.id, email: currentUser.email, role: currentUser.role });
    await saveToken(currentUser.id, refreshToken);

    res.cookie('accessToken', accessToken, getAccessTokenCookieOptions());
    res.cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: currentUser.id,
        role: currentUser.role,
        name: currentUser.name,
        surename: currentUser.surename,
        email: currentUser.email,
        phone: currentUser.phone,
      },
    });
  }
);

export const logoutController = CatchAsyncError(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    logoutValidation(refreshToken);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  }
);