import { Request, Response } from "express";

import { CatchAsyncError } from "../utils/catchAsyncErrors";
import { prisma } from "../utils/prisma";
import { createMenuItemValidation } from "../services/menuItem.service";
import { uploadImage } from "../utils/cloudinaryHelpers";

export const createMenuItemController = CatchAsyncError(
  async (req: Request, res: Response) => {
    const newMenuItemData = await createMenuItemValidation(req.body);

    const menuItemImageUrl = await uploadImage(newMenuItemData.thumbnail);

    const { thumbnail: _, ...formatedMenuItem } = newMenuItemData;

    const newMenuItem = await prisma.menuItem.create({ data: { ...formatedMenuItem, imageUrl: menuItemImageUrl } });

    res.status(201).json({
      success: true,
      message: "Menu Item created successfully",
      data: newMenuItem,
    });
  }
);

export const getAllMenuItemsController = CatchAsyncError(
  async (req: Request, res: Response) => {
    const { categoryId } = req.params;

    const menuFilters = categoryId ? { where: { categoryId } } : undefined;

    const allMenuItems = await prisma.menuItem.findMany(menuFilters);

    res.status(200).json({
      success: true,
      message: "All categories",
      data: allMenuItems,
    });
  }
);