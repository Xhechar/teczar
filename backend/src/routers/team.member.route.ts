import { Router } from "express";
import { TeamMemberController } from "../controllers/team.member.controller.js";
import { verifyAdmin, VerifyToken } from "../middleware/middleware.js";

export const TeamMemberRouter = Router();
const tmController: TeamMemberController = new TeamMemberController();

TeamMemberRouter.post(
  "/create",
    VerifyToken,
    verifyAdmin,
  async (req, res) => await tmController.Create(req, res),
);

TeamMemberRouter.put(
  "/update/:id",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await tmController.Update(req, res),
);

TeamMemberRouter.delete(
  "/delete/:id",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await tmController.Delete(req, res),
);

TeamMemberRouter.get(
  "/get-all",
  async (req, res) => await tmController.FetchAll(req, res),
);