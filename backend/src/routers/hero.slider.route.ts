import { Router } from "express";
import { HeroSliderController } from "../controllers/hero.slider.controller.js";

export const HeroSliderRouter = Router();

const hsController = new HeroSliderController();

HeroSliderRouter.post(
  "/create",
  async (req, res) => await hsController.Create(req, res),
);

HeroSliderRouter.put(
  "/update/:id",
  async (req, res) => await hsController.Update(req, res),
);

HeroSliderRouter.delete(
  "/delete/:id",
  async (req, res) => await hsController.Delete(req, res),
);

HeroSliderRouter.patch(
  "/toggle-active/:id",
  async (req, res) => await hsController.ToggleActive(req, res),
);

HeroSliderRouter.get(
  "/get-all",
  async (req, res) => await hsController.FetchAll(req, res),
);

HeroSliderRouter.get(
  "/get-active",
  async (req, res) => await hsController.FetchActive(req, res),
);
