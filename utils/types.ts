import { Roles } from "@prisma/client";

type ErrorResponse = {
    status: false;
    message: string;
}

type SuccessResponse<T> = {
    status: true;
    data: T;
}

type FinalResponse<T> = ErrorResponse | SuccessResponse<T>;

export type ErrorDetails = Record<string, string[]>
export type CustomErrorStructure = {
    statusCode: number;
    message: string;
    errorDetails?: ErrorDetails;
}


export type TokenPayload = {
    id: string;
    email: string;
    role: Roles;
}

export type AccessTokenType = string;
export type RefreshTokenType = string;