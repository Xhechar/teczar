import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.js";
import { verifyAdmin, VerifyToken, verifyUser } from "../middleware/middleware.js";

export const CategoryRouter = Router();

const categoryController: CategoryController = new CategoryController();

CategoryRouter.post(
  "/create",
    VerifyToken,
    verifyAdmin,
  async (req, res) => await categoryController.Create(req, res),
);

CategoryRouter.put(
  "/update/:id",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await categoryController.Update(req, res),
);

CategoryRouter.delete(
  "/delete/:id",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await categoryController.Delete(req, res),
);

CategoryRouter.get(
  "/get-all",
  async (req, res) => await categoryController.FetchAll(req, res),
);