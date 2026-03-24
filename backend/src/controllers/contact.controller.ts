import type { Request, Response } from "express";
import { ContactService } from "../services/contact.service.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import { ErrorType } from "../enums/enums.js";

export class ContactController {
  private contactService: ContactService = new ContactService();

  async SendContactMail(Req: Request, Res: Response) {
    try {

      let result = await this.contactService.SendContactMail(Req.body);

      return result.Success ? Res.status(201).json(result) : Res.status(400).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.Failure<object>(ErrorType.SERVER, error instanceof Error ? error.message : "Internal server error occured."));
    }
  }
}