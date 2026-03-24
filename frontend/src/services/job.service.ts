import { CreateJobDto, FetchJobDto, UpdateJobDto } from "../dtos/dto";
import { Job } from "../interfaces/interfaces";
import { ServiceResult } from "../interfaces/result/service.result";
import { api } from "../middleware/middleware";

export class JobService {
  private static readonly ApiUrl = "job";

  public static async Create(
    job: CreateJobDto,
  ): Promise<ServiceResult<FetchJobDto>> {
    let result = await api.post<ServiceResult<FetchJobDto>>(
      `${this.ApiUrl}/create`,
      job,
    );
    return result.data;
  }

  public static async Update(
    id: string,
    job: UpdateJobDto,
  ): Promise<ServiceResult<FetchJobDto>> {
    let result = await api.put<ServiceResult<FetchJobDto>>(
      `${this.ApiUrl}/update/${id}`,
      job,
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
  ): Promise<ServiceResult<FetchJobDto>> {
    let result = await api.get<ServiceResult<FetchJobDto>>(
      `${this.ApiUrl}/get/${id}`,
    );
    return result.data;
  }

  public static async FetchAll(): Promise<ServiceResult<Job>> {
    let result = await api.get<ServiceResult<Job>>(
      `${this.ApiUrl}/get-all`,
    );
    return result.data;
  }

  public static async FetchActive(): Promise<ServiceResult<FetchJobDto>> {
    let result = await api.get<ServiceResult<FetchJobDto>>(
      `${this.ApiUrl}/get-active`,
    );
    return result.data;
  }

  public static async SoftDelete(
    id: string,
  ): Promise<ServiceResult<FetchJobDto>> {
    let result = await api.put<ServiceResult<FetchJobDto>>(
      `${this.ApiUrl}/soft-delete/${id}`,
    );
    return result.data;
  }
}
