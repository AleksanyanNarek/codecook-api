import { Request, Response } from "express";

import { CatchAsyncError } from "../utils/catchAsyncErrors";
import { prisma } from "../utils/prisma";
import { createCategoryValidation } from "../services/category.service";
import { uploadImage } from "../utils/cloudinaryHelpers";

export const createCategoryController = CatchAsyncError(
  async (req: Request, res: Response) => {
    const newCategoryData = await createCategoryValidation(req.body);

    const categoryImageUrl = await uploadImage(newCategoryData.thumbnail);

    const newCategory = await prisma.category.create({ data: { name: newCategoryData.name, imageUrl: categoryImageUrl } });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory,
    });
  }
);

export const getAllCategoriesController = CatchAsyncError(
  async (req: Request, res: Response) => {
    const allCategories = await prisma.category.findMany({ select: { id: true, name: true } });

    res.status(200).json({
      success: true,
      message: "All categories",
      data: allCategories,
    });
  }
);

export const getSomeCategoriesController = CatchAsyncError(
  async (req: Request, res: Response) => {
    const allCategories = await prisma.category.findMany({ take: 4,  });

    res.status(200).json({
      success: true,
      message: "get some categories",
      data: allCategories,
    });
  }
);