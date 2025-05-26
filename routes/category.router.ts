import { Router } from "express";
import { createCategoryController, getAllCategoriesController, getSomeCategoriesController } from "../controllers/category.controller";
import { authMiddleware, checkAdminRole } from "../middleware/auth";

export const categoryRouter = Router();

categoryRouter.post('/',  authMiddleware, checkAdminRole, createCategoryController);
categoryRouter.get('/', getAllCategoriesController);
categoryRouter.get('/main', getSomeCategoriesController);