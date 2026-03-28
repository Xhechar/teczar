import { SendMail } from "../emails/config/email.config.js";
import { ErrorType } from "../enums/enums.js";
import type {
  ContactFormData,
  MessageOptions,
} from "../interfaces/interfaces.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import type { ServiceResult } from "../interfaces/result/service.result.js";
import { Logger } from "../logs/logger.js";
import { contactFormSchema } from "../validators/validators.js";
import ejs from "ejs";
import path from "path";

export class ContactService {
  async SendContactMail(
    formData: ContactFormData,
  ): Promise<ServiceResult<object>> {
    
    const { error } = contactFormSchema.validate(formData);
    if (error) {
      return ServiceResponse.Failure<object>(
        ErrorType.VALIDATION,
        error.details[0]?.message as string,
      );
    }

    try {
      
      const templatePath = path.resolve("templates/contact_form.ejs");

      const data = await ejs.renderFile(templatePath, { formData });

      const messageOptions: MessageOptions = {
        from: formData.Email,
        to: process.env.EMAIL as string,
        subject: formData.Subject,
        html: data,
      };

      await SendMail(messageOptions);

      return ServiceResponse.Success<object>(
        "Message sent successfully. Kindly await follow up.",
      );
    } catch (err) {
      Logger.error(
        err instanceof Error ? err.message : "Unable to send contact form mail",
      );
      return ServiceResponse.Failure<object>(
        ErrorType.SERVER,
        err instanceof Error ? err.message : "Internal server error occurred.",
      );
    }
  }
}