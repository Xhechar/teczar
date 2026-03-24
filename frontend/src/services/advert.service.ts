import { CreateAdvertDto, FetchAdvertDto, UpdateAdvertDto } from "../dtos/dto";
import { Advert } from "../interfaces/interfaces";
import { ServiceResult } from "../interfaces/result/service.result";
import { api } from "../middleware/middleware";

export class AdvertService {
  private static readonly ApiUrl = "advert";

  public static async Create(
    advert: CreateAdvertDto,
  ): Promise<ServiceResult<FetchAdvertDto>> {
    let result = await api.post<ServiceResult<FetchAdvertDto>>(
      `${this.ApiUrl}/create`,
      advert,
    );
    return result.data;
  }

  public static async Update(
    id: string,
    advert: UpdateAdvertDto,
  ): Promise<ServiceResult<FetchAdvertDto>> {
    let result = await api.put<ServiceResult<FetchAdvertDto>>(
      `${this.ApiUrl}/update/${id}`,
      advert,
    );
    return result.data;
  }

  public static async ToggleAdvert(
    id: string,
  ): Promise<ServiceResult<FetchAdvertDto>> {
    let result = await api.put<ServiceResult<FetchAdvertDto>>(
      `${this.ApiUrl}/toggle-advert/${id}`,
    );
    return result.data;
  }

  public static async Delete(id: string): Promise<ServiceResult<boolean>> {
    let result = await api.delete<ServiceResult<boolean>>(
      `${this.ApiUrl}/delete/${id}`,
    );
    return result.data;
  }

  public static async FetchById(
    id: string,
  ): Promise<ServiceResult<FetchAdvertDto>> {
    let result = await api.get<ServiceResult<FetchAdvertDto>>(
      `${this.ApiUrl}/get/${id}`,
    );
    return result.data;
  }

  public static async FetchActiveAdverts(): Promise<
    ServiceResult<FetchAdvertDto>
  > {
    let result = await api.get<ServiceResult<FetchAdvertDto>>(
      `${this.ApiUrl}/get-active`,
    );
    return result.data;
  }

  public static async FetchAll(): Promise<ServiceResult<Advert>> {
    let result = await api.get<ServiceResult<Advert>>(`${this.ApiUrl}/get-all`);
    return result.data;
  }
}
