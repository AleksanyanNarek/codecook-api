import { Request, Response, NextFunction } from "express";

import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../utils/catchAsyncErrors";
import { generateTokens, getAccessTokenCookieOptions, getRefreshTokenCookieOptions, saveToken, verifyAccessToken, verifyRefreshToken } from "../services/token.service";
import { checkAccessToken } from "../services/auth.service";
import { TokenPayload } from "../utils/types";

export const authMiddleware = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { Authorization: authorizationHeader } = req.headers;

        const currentUser = checkAccessToken(authorizationHeader);

        if (currentUser) {
            req.tokenUser = currentUser;
            next();
        }

        const { refreshtoken: refreshTokenHeader } = req.headers;

        if (typeof refreshTokenHeader !== 'string') {
            throw ErrorHandler.UnauthorizedError();
        }

        const userData = verifyRefreshToken(refreshTokenHeader);
        if (!userData) {
            throw ErrorHandler.UnauthorizedError();
        }

        const { accessToken, refreshToken } = generateTokens(userData);

        await saveToken(userData.id, refreshToken);

        res.cookie('accessToken', accessToken, getAccessTokenCookieOptions());
        res.cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());

        req.tokenUser = userData;
        next();
    }
);

export const checkAdminRole = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        const tokenUser = req.tokenUser as TokenPayload;

        if (tokenUser.role !== "ADMIN") {
            throw new ErrorHandler({
                statusCode: 403,
                message: "Don't have access to this resource",
            });
        }

        next();
    }
)