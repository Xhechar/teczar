import { Router } from "express";
import { CartController } from "../controllers/cart.controller.js";
import { VerifyToken, verifyUser } from "../middleware/middleware.js";

export const CartRouter = Router();

const cartController: CartController = new CartController();

CartRouter.get(
  "/get",
    VerifyToken,
    verifyUser,
  async (req, res) => await cartController.FetchByUserId(req, res),
);