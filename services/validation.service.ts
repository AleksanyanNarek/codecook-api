import { ZodSchema } from "zod";

import { ErrorDetails } from "../utils/types";
import ErrorHandler from "../utils/ErrorHandler";

export const checkSchema = (data: unknown, schema: ZodSchema) => {
  const parsedResult = schema.safeParse(data);

  if (!parsedResult.success) {
    parsedResult.error?.flatten();

    throw new ErrorHandler({
      statusCode: 400,
      message: 'Validation error',
      errorDetails: parsedResult.error?.flatten().fieldErrors as ErrorDetails,
    });
  }

  return parsedResult.data;
}