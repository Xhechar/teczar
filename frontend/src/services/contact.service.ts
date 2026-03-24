import { ContactFormData } from "../interfaces/interfaces";
import { ServiceResult } from "../interfaces/result/service.result";
import { api } from "../middleware/middleware";

export class ContactService {
  private static readonly ApiUrl = `contact`;

  public static async SendContactMail(
    dto: ContactFormData,
  ): Promise<ServiceResult<object>> {
    const result = await api.post<ServiceResult<object>>(
      `${this.ApiUrl}/send-contact-mail`,
      dto,
    );
    return result.data;
  }
}