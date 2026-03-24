import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { VerifyToken, verifyAdmin, verifyUser } from "../middleware/middleware.js";

export const UserRouter = Router();
const userController = new UserController();

UserRouter.post(
  "/create",
  async (req, res) => await userController.Create(req, res),
);
UserRouter.put(
  "/update",
    VerifyToken,
  async (req, res) => await userController.Update(req, res),
);
UserRouter.put(
  "/admin-update/:id",
  VerifyToken,
  async (req, res) => await userController.AdminUpdate(req, res),
);
UserRouter.delete(
  "/delete/:id",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await userController.Delete(req, res),
);
UserRouter.get(
  "/get",
  VerifyToken,
  verifyUser,
  async (req, res) => await userController.FetchById(req, res),
);
UserRouter.get(
  "/get-all",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await userController.FetchAll(req, res),
);
UserRouter.patch(
  "/toggle-activate/:id",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await userController.ToggleActivate(req, res),
);
