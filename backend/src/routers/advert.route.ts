import { Router } from "express";
import { AdvertController } from "../controllers/advert.controller.js";
import { verifyAdmin, VerifyToken } from "../middleware/middleware.js";

export const AdvertRouter = Router();

const advertController: AdvertController = new AdvertController();

AdvertRouter.post(
  "/create",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await advertController.Create(req, res),
);

AdvertRouter.put(
  "/toggle-advert/:id",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await advertController.ToggleAdvert(req, res),
);

AdvertRouter.put(
  "/update/:id",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await advertController.Update(req, res),
);

AdvertRouter.delete(
  "/delete/:id",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await advertController.Delete(req, res),
);

AdvertRouter.get(
  "/get/:id",
  VerifyToken,
  verifyAdmin,
  async (req, res) => await advertController.FetchById(req, res),
);

AdvertRouter.get(
  "/get-active",
  async (req, res) => await advertController.FetchActiveAdverts(req, res),
);

AdvertRouter.get(
  "/get-all",
  async (req, res) => await advertController.FetchAll(req, res),
);