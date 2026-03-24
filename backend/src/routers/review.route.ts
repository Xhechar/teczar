import { Router } from "express";
import { ReviewController } from "../controllers/review.controller.js";
import { VerifyToken, verifyAdmin, verifyUser } from "../middleware/middleware.js";

export const ReviewRouter = Router();

const reviewController: ReviewController = new ReviewController();

ReviewRouter.post(
  "/create",
    VerifyToken,
    verifyUser,
  async (req, res) => await reviewController.Create(req, res),
);

ReviewRouter.put(
  "/update/:id",
  VerifyToken,
  async (req, res) => await reviewController.Update(req, res),
);

ReviewRouter.delete(
  "/delete/:id",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await reviewController.Delete(req, res),
);

ReviewRouter.get(
  "/get/:id",
  async (req, res) => await reviewController.FetchById(req, res),
);

ReviewRouter.get(
  "/get-by-user",
  VerifyToken,
  verifyUser,
  async (req, res) => await reviewController.FetchByUserId(req, res),
);

ReviewRouter.get(
  "/get-all",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await reviewController.FetchAll(req, res),
);

ReviewRouter.get(
  "/get-approved",
  async (req, res) => await reviewController.FetchApproved(req, res),
);

ReviewRouter.put(
  "/update-status/:id",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await reviewController.UpdateStatus(req, res),
);
