import { z } from "zod";
import { checkSchema } from "../utils/checkSchema";
import { prisma } from "../utils/prisma";
import ErrorHandler from "../utils/ErrorHandler";

const createCategorySchema = z.object({
  name: z.string().trim().min(1).max(20, "Category name must be between 1 and 20 characters"),
  thumbnail: z.string().min(1, "Thumbnail is required"),
});

export const createCategoryValidation = async (createCategoryBody: unknown) => {
  const newCategoryData = checkSchema(createCategoryBody, createCategorySchema);

  const existingCategory = await prisma.category.findFirst({ where: { name: newCategoryData.name } });

  if (existingCategory) {
    throw new ErrorHandler({
      statusCode: 409,
      message: 'Category already exists with this name',
      errorDetails: { name: ["Category already exists"] },
    });
  }

  return newCategoryData;
}