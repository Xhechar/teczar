import { Router } from "express";
import { ProductImageController } from "../controllers/product.image.controller.js";
import { VerifyToken, verifyAdmin } from "../middleware/middleware.js";

export const ProductImageRouter = Router();

const piController: ProductImageController = new ProductImageController();

ProductImageRouter.post(
  "/create",
    VerifyToken,
    verifyAdmin,
  async (req, res) => await piController.Create(req, res),
);

ProductImageRouter.put(
  "/update/:id",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await piController.Update(req, res),
);

ProductImageRouter.delete(
  "/delete/:id",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await piController.Delete(req, res),
);
