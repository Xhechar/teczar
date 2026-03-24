import { Router } from "express";
import { CartItemController } from "../controllers/cart.item.controller.js";
import { VerifyToken, verifyUser } from "../middleware/middleware.js";

export const CartItemRouter = Router();

const cartItemController: CartItemController = new CartItemController();

CartItemRouter.post(
  "/create",
    VerifyToken,
    verifyUser,
  async (req, res) => await cartItemController.Create(req, res),
);

CartItemRouter.put(
  "/update/:id",
  VerifyToken,
  verifyUser,
  async (req, res) => await cartItemController.Update(req, res),
);

CartItemRouter.delete(
  "/delete/:id",
  VerifyToken,
  verifyUser,
  async (req, res) => await cartItemController.Delete(req, res),
);