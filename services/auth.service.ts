import { z } from "zod";
import bcrypt from "bcryptjs";

import ErrorHandler from "../utils/ErrorHandler";
import { checkSchema } from "./validation.service";
import { prisma } from "../utils/prisma";
import { User } from "@prisma/client";

const registrationSchema = z.object({
  name: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
  surename: z.string().min(1),
  email: z.string().email(),
  phone: z.string().startsWith('0').min(9),
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
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginValidation = async (loginBody: unknown): Promise<User> => {
  const loginData = checkSchema(loginBody, loginSchema);

  const currentUser = await prisma.user.findUnique({ where: { email: loginData.email } });

  if (!currentUser) {
    throw new ErrorHandler({ statusCode: 400, message: 'Wrong credentials', errorDetails: { email: ["Wrong credentials"] } });
  }

  const isPassEquals = await bcrypt.compare(loginData.password, currentUser.hashedPassword);
  if (!isPassEquals) {
    throw new ErrorHandler({ statusCode: 400, message: 'Wrong credentials', errorDetails: { email: ["Wrong credentials"] } });
  }

  return currentUser;
}