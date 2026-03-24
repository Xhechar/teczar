import { Router } from "express";
import { OrderController } from "../controllers/order.controller.js";
import { VerifyToken, verifyAdmin, verifyUser } from "../middleware/middleware.js";

export const OrderRouter = Router();

const orderController: OrderController = new OrderController();

OrderRouter.get(
  "/get-by-user",
    VerifyToken,
    verifyUser,
  async (req, res) => await orderController.FetchByUserId(req, res),
);

OrderRouter.get(
  "/get-all",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await orderController.FetchAll(req, res),
);

OrderRouter.put(
  "/update-status/:id",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await orderController.UpdateOrderStatus(req, res),
);