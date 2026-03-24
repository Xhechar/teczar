import { Router } from "express";
import { ContactController } from "../controllers/contact.controller.js";

export const ContactRouter = Router();

const contactController: ContactController = new ContactController();

ContactRouter.post('/send-contact-mail', async (req, res) => await contactController.SendContactMail(req, res))