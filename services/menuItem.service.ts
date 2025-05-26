import { z } from "zod";
import { checkSchema } from "../utils/checkSchema";
import { prisma } from "../utils/prisma";
import ErrorHandler from "../utils/ErrorHandler";

const createMenuItemSchema = z.object({
  name: z.string().trim().min(1).max(30, "Menu item name must be between 1 and 30 characters"),
  description: z.string().trim().min(1),
  price: z
    .string()
    .refine(val => !isNaN(Number(val)) && val.trim() !== '', {
      message: "Must be a string that can be converted to a number",
    })
    .transform(val => Number(val))
    .refine(val => val >= 0, {
      message: "Price must be a positive number",
    }),
  thumbnail: z.string().min(1, "Thumbnail is required"),
  categoryId: z.string().cuid("Invalid category ID"),
});

export const createMenuItemValidation = async (createMenuItemBody: unknown) => {
  const newMenuItemData = checkSchema(createMenuItemBody, createMenuItemSchema);

  const existingMenuItem = await prisma.menuItem.findFirst({ where: { name: newMenuItemData.name } });

  if (existingMenuItem) {
    throw new ErrorHandler({
      statusCode: 409,
      message: 'MenuItem already exists with this name',
      errorDetails: { name: ["MenuItem already exists"] },
    });
  }

  const existingCategory = await prisma.category.findFirst({ where: { id: newMenuItemData.categoryId } });

  if (!existingCategory) {
    throw new ErrorHandler({
      statusCode: 409,
      message: 'Not existed category',
      errorDetails: { categoryId: ["Not existed category"] },
    });
  }

  return newMenuItemData;
}