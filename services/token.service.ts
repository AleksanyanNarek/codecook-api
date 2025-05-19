import dotenv from 'dotenv';
import jwt, { SignOptions } from 'jsonwebtoken';

import { AccessTokenType, RefreshTokenType, TokenPayload } from '../utils/types';
import { prisma } from '../utils/prisma';
import ErrorHandler from '../utils/ErrorHandler';
import { CookieOptions } from 'express';

dotenv.config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

const JWT_ACCESS_EXPIRES_IN =  1000 * 60 * 15; // 15 minutes
const JWT_REFRESH_EXPIRES_IN = 1000 * 60 * 60 * 24 * 30; // 30 days

export function generateTokens (
    payload: TokenPayload,
    // accessOptions: SignOptions = {},
    // refreshOptions: SignOptions = {},
): {
    accessToken: AccessTokenType;
    refreshToken: RefreshTokenType;
} {
    if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
        throw new ErrorHandler({ statusCode: 500, message: 'JWT secrets are not defined' });
    }

    const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
        expiresIn: JWT_ACCESS_EXPIRES_IN,
        // ...accessOptions,
    });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
        // ...refreshOptions,
    });

    return {
        accessToken,
        refreshToken,
    }
}

export function verifyAccessToken(token: string): TokenPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

        return decoded as TokenPayload;
    } catch (err) {
        return null;
    }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_REFRESH_SECRET);

        return decoded as TokenPayload;
    } catch (err) {
        return null;
    }
}

export const getRefreshTokenCookieOptions = (): CookieOptions => ({ maxAge: JWT_REFRESH_EXPIRES_IN, httpOnly: true, secure: true, sameSite: 'none' })
export const getAccessTokenCookieOptions = (): CookieOptions => ({ maxAge: JWT_ACCESS_EXPIRES_IN, httpOnly: true, secure: true, sameSite: 'none' })

export async function saveToken(userId: string, refreshToken: RefreshTokenType) {
    return await prisma.refreshToken.upsert({
        where: { userId },
        update: {
            refreshToken,
            expiresAt: new Date(Date.now() + JWT_REFRESH_EXPIRES_IN),
        },
        create: {
            userId,
            refreshToken,
            expiresAt: new Date(Date.now() + JWT_REFRESH_EXPIRES_IN),
        },
    });
}

export async function removeToken(refreshToken: RefreshTokenType) {
    return await prisma.refreshToken.deleteMany({ where: { refreshToken } })
}

export async function findToken(userId: string) {
    return await prisma.refreshToken.findUnique({ where: { userId } })
}