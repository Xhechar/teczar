import { Router } from "express";
import { JobApplicationController } from "../controllers/job.application.controller.js";
import { VerifyToken, verifyAdmin, verifyUser } from "../middleware/middleware.js";

export const JobApplicationRouter = Router();

const jaController: JobApplicationController = new JobApplicationController();

JobApplicationRouter.post(
  "/create",
  async (req, res) => await jaController.Create(req, res),
);

JobApplicationRouter.delete(
  "/delete/:id",
    VerifyToken,
  async (req, res) => await jaController.Delete(req, res),
);

JobApplicationRouter.get(
  "/get/:id",
  VerifyToken,
  async (req, res) => await jaController.FetchById(req, res),
);

JobApplicationRouter.get(
  "/get-by-user",
  VerifyToken,
  verifyUser,
  async (req, res) => await jaController.FetchByUserId(req, res),
);

JobApplicationRouter.get(
  "/get-all",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await jaController.FetchAll(req, res),
);

JobApplicationRouter.put(
  "/update-status/:id",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await jaController.UpdateApplicationStatus(req, res),
);