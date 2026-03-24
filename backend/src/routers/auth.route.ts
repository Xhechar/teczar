import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { VerifyToken } from "../middleware/middleware.js";

export const AuthRouter = Router();

const authController = new AuthController();

AuthRouter.post("/login", (req, res) => authController.LoginUser(req, res));

AuthRouter.post("/verify-email", (req, res) =>
  authController.VerifyMail(req, res),
);

AuthRouter.post("/reset-password", (req, res) =>
  authController.ResetPassword(req, res),
);

AuthRouter.post("/refresh", (req, res) =>
  authController.RefreshToken(req, res),
);

AuthRouter.post("/change-password", VerifyToken, (req, res) =>
  authController.ChangePassword(req, res),
);
AuthRouter.post("/logout", VerifyToken, (req, res) =>
  authController.LogoutUser(req, res),
);
AuthRouter.get("/is-authenticated", VerifyToken, (req, res) =>
  authController.IsAuthenticated(req, res),
);