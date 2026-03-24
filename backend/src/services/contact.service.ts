import { SendMail } from "../emails/config/email.config.js";
import { ErrorType } from "../enums/enums.js";
import type { ContactFormData, MessageOptions } from "../interfaces/interfaces.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import type { ServiceResult } from "../interfaces/result/service.result.js";
import { Logger } from "../logs/logger.js";
import { contactFormSchema } from "../validators/validators.js";
import ejs from 'ejs';

export class ContactService {
  async SendContactMail(formData: ContactFormData): Promise<ServiceResult<Object>> {
    let {error} = contactFormSchema.validate(formData);

    if(error) {
      return ServiceResponse.Failure<object>(ErrorType.VALIDATION, error.details[0]?.message as string);
    }

    try {
      ejs.renderFile('templates/contact_form.ejs', {formData}, async(error, data) => {
        if(error) {
          Logger.error(error instanceof Error ? error.message : "Unable to send contact form mail");
        } else {
          let messageOptions: MessageOptions = {
            from: formData.Email,
            to: process.env.EMAIL as string,
            subject: formData.Subject,
            html: data,
          };
  
          await SendMail(messageOptions);
        }
      });
    } catch (error) {
      return ServiceResponse.Failure<object>(ErrorType.SERVER, error instanceof Error ? error.message : "Internal server error occured.");
    }

    return ServiceResponse.Success<object>("Message sent successfully. Kindly await follow up.");
  }
}