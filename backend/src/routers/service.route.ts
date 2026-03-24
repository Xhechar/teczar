import { Router } from "express";
import { ServiceController } from "../controllers/service.controller.js";
import { VerifyToken, verifyAdmin } from "../middleware/middleware.js";

export const ServiceRouter = Router();

const serviceController = new ServiceController();

ServiceRouter.post(
  "/create",
    VerifyToken,
    verifyAdmin,
  async (req, res) => await serviceController.Create(req, res),
);

ServiceRouter.put(
  "/update/:id",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await serviceController.Update(req, res),
);

ServiceRouter.delete(
  "/delete/:id",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await serviceController.Delete(req, res),
);

ServiceRouter.get(
  "/get/:id",
  async (req, res) => await serviceController.FetchById(req, res),
);

ServiceRouter.get(
  "/get-all",
  async (req, res) => await serviceController.FetchAll(req, res),
);
