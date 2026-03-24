import { Router } from "express";
import { ServiceRequestController } from "../controllers/service.request.controller.js";
import { VerifyToken, verifyAdmin, verifyUser } from "../middleware/middleware.js";

export const ServiceRequestRouter = Router();
const srController = new ServiceRequestController();

ServiceRequestRouter.post(
  "/create",
    VerifyToken,
    verifyUser,
  async (req, res) => await srController.Create(req, res),
);

ServiceRequestRouter.put(
  "/update/:id",
  VerifyToken,
  async (req, res) => await srController.Update(req, res),
);

ServiceRequestRouter.delete(
  "/delete/:id",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await srController.Delete(req, res),
);

ServiceRequestRouter.get(
  "/get/:id",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await srController.FetchById(req, res),
);

ServiceRequestRouter.patch(
  "/update-status/:id",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await srController.UpdateStatus(req, res),
);

ServiceRequestRouter.get(
  "/get-all",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await srController.FetchAll(req, res),
);

ServiceRequestRouter.get(
  "/get-by-user",
  VerifyToken,
  verifyUser,
  async (req, res) => await srController.FetchByUserId(req, res),
);
