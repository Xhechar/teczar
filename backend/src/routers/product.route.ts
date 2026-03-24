import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";
import { VerifyToken, verifyAdmin } from "../middleware/middleware.js";

export const ProductRouter = Router();

const productController: ProductController = new ProductController();

ProductRouter.post(
  "/create",
    VerifyToken,
    verifyAdmin,
  async (req, res) => await productController.Create(req, res),
);

ProductRouter.put(
  "/update/:id",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await productController.Update(req, res),
);

ProductRouter.delete(
  "/delete/:id",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await productController.Delete(req, res),
);

ProductRouter.get(
  "/get/:id",
  async (req, res) => await productController.FetchById(req, res),
);

ProductRouter.get(
  "/get-all",
  async (req, res) => await productController.FetchAll(req, res),
);
