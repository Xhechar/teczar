import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller.js";
import { VerifyToken, verifyAdmin, verifyUser } from "../middleware/middleware.js";

export const PaymentRouter = Router();

const paymentController: PaymentController = new PaymentController();

PaymentRouter.post(
  "/initiate",
    VerifyToken,
    verifyUser,
  async (req, res) => await paymentController.InitiatePayment(req, res),
);

PaymentRouter.post(
  "/retry/:id",
  VerifyToken,
  verifyUser,
  async (req, res) => await paymentController.RetryPayment(req, res),
);

PaymentRouter.post(
  "/stk-callback",
  async (req, res) => await paymentController.StkCallBackReceiver(req, res),
);

PaymentRouter.get(
  "/get-all",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await paymentController.GetAllPayments(req, res),
);
