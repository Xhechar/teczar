import { Router } from "express";
import { JobController } from "../controllers/job.controller.js";
import { VerifyToken, verifyAdmin } from "../middleware/middleware.js";

export const JobRouter = Router();

const jobController: JobController = new JobController();

JobRouter.post(
  "/create",
    VerifyToken,
    verifyAdmin,
  async (req, res) => await jobController.Create(req, res),
);

JobRouter.put(
  "/update/:id",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await jobController.Update(req, res),
);

JobRouter.delete(
  "/delete/:id",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await jobController.Delete(req, res),
);

JobRouter.get(
  "/get/:id",
  async (req, res) => await jobController.FetchById(req, res),
);

JobRouter.get(
  "/get-all",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await jobController.FetchAll(req, res),
);

JobRouter.get(
  "/get-active",
  async (req, res) => await jobController.FetchActive(req, res),
);

JobRouter.put(
  "/soft-delete/:id",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await jobController.SoftDelete(req, res),
);