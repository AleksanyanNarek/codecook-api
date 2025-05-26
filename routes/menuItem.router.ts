import { Router } from "express";
import { createMenuItemController, getAllMenuItemsController } from "../controllers/menuItem.controller";
import { authMiddleware, checkAdminRole } from "../middleware/auth";

export const menuItemRouter = Router();

menuItemRouter.post('/', authMiddleware, checkAdminRole, createMenuItemController);
menuItemRouter.get('/', getAllMenuItemsController);