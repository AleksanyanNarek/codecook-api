import { z } from "zod";
import bcrypt from "bcryptjs";

import ErrorHandler from "../utils/ErrorHandler";
import { checkSchema } from "../utils/checkSchema";
import { prisma } from "../utils/prisma";
import { User } from "@prisma/client";
import { removeToken, verifyAccessToken } from "./token.service";
import { TokenPayload } from "../utils/types";

const registrationSchema = z.object({
  name: z.string().trim().min(1),
  password: z.string().trim().min(8, "Password must be at least 8 characters"),
  surename: z.string().trim().min(1),
  email: z.string().email(),
  phone: z.string().trim().startsWith('0').min(9),
});

type RegistrationData = z.infer<typeof registrationSchema>;

export const registrationValidation = async (registrationBody: unknown): Promise<RegistrationData> => {
  const registrationData = checkSchema(registrationBody, registrationSchema);

  const existingUser = await prisma.user.findUnique({ where: { email: registrationData.email } });

  if (existingUser) {
    throw new ErrorHandler({
      statusCode: 409,
      message: 'User already exists with this email',
      errorDetails: { email: ["User with this email already exists"] },
    });
  }

  return registrationData;
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().trim().min(8, "Password must be at least 8 characters"),
});

export const loginValidation = async (loginBody: unknown): Promise<User> => {
  const loginData = checkSchema(loginBody, loginSchema);

  const currentUser = await prisma.user.findUnique({ where: { email: loginData.email }, select: {
    id: true,
    role: true,
    hashedPassword: true,
    name: true,
    surename: true,
    email: true,
    phone: true,
  } });

  if (!currentUser) {
    throw new ErrorHandler({ statusCode: 400, message: 'Wrong credentials', errorDetails: { email: ["Wrong credentials"] } });
  }

  const isPassEquals = await bcrypt.compare(loginData.password, currentUser.hashedPassword);
  if (!isPassEquals) {
    throw new ErrorHandler({ statusCode: 400, message: 'Wrong credentials', errorDetails: { email: ["Wrong credentials"] } });
  }

  return currentUser;
}

export const logoutValidation = async (refreshToken: string | undefined) => {
  if (!refreshToken) {
    throw ErrorHandler.UnauthorizedError();
  }

  const { count: deletedTokensCount } = await removeToken(refreshToken);

  if (deletedTokensCount === 0) {
    throw ErrorHandler.UnauthorizedError();
  }
}

export const checkAccessToken = (authorizationHeader: string | string[] | undefined): TokenPayload | null => {
  if (typeof authorizationHeader !== 'string') return null;

  const { 0: type, 1: accessTokenHeader } = authorizationHeader.split(' ');

  // Check if the access token header is available then verify it (optimization)
  const currentUser = accessTokenHeader && verifyAccessToken(accessTokenHeader);
  if (!currentUser) {
    return null;
  }

  return currentUser;
}