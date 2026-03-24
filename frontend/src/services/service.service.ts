import { CreateServiceDto, FetchServiceDto, UpdateServiceDto } from "../dtos/dto";
import { Service } from "../interfaces/interfaces";
import { ServiceResult } from "../interfaces/result/service.result";
import { api } from "../middleware/middleware";

export class ServicesService {
  private static readonly ApiUrl = "service";

  public static async Create(
    payload: CreateServiceDto,
  ): Promise<ServiceResult<FetchServiceDto>> {
    const result = await api.post<ServiceResult<FetchServiceDto>>(
      `${this.ApiUrl}/create`,
      payload,
    );
    return result.data;
  }

  public static async Update(
    id: string,
    payload: UpdateServiceDto,
  ): Promise<ServiceResult<FetchServiceDto>> {
    const result = await api.put<ServiceResult<FetchServiceDto>>(
      `${this.ApiUrl}/update/${id}`,
      payload,
    );
    return result.data;
  }

  public static async Delete(id: string): Promise<ServiceResult<boolean>> {
    const result = await api.delete<ServiceResult<boolean>>(
      `${this.ApiUrl}/delete/${id}`,
    );
    return result.data;
  }

  public static async FetchById(
    id: string,
  ): Promise<ServiceResult<FetchServiceDto>> {
    const result = await api.get<ServiceResult<FetchServiceDto>>(
      `${this.ApiUrl}/get/${id}`,
    );
    return result.data;
  }

  public static async FetchAll(): Promise<ServiceResult<Service>> {
    const result = await api.get<ServiceResult<Service>>(
      `${this.ApiUrl}/get-all`,
    );
    return result.data;
  }
}
