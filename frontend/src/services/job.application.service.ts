import { CreateJobApplicationDto, FetchJobApplicationDto } from "../dtos/dto";
import { JobApplication } from "../interfaces/interfaces";
import { ServiceResult } from "../interfaces/result/service.result";
import { api } from "../middleware/middleware";

export class JobApplicationService {
  private static readonly ApiUrl = "job-application";

  public static async Create(
    application: CreateJobApplicationDto,
  ): Promise<ServiceResult<FetchJobApplicationDto>> {
    let result = await api.post<ServiceResult<FetchJobApplicationDto>>(
      `${this.ApiUrl}/create`,
      application,
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
  ): Promise<ServiceResult<FetchJobApplicationDto>> {
    let result = await api.get<ServiceResult<FetchJobApplicationDto>>(
      `${this.ApiUrl}/get/${id}`,
    );
    return result.data;
  }

  public static async FetchByUser(): Promise<
    ServiceResult<FetchJobApplicationDto>
  > {
    let result = await api.get<ServiceResult<FetchJobApplicationDto>>(
      `${this.ApiUrl}/get-by-user`,
    );
    return result.data;
  }

  public static async FetchAll(): Promise<
    ServiceResult<JobApplication>
  > {
    let result = await api.get<ServiceResult<JobApplication>>(
      `${this.ApiUrl}/get-all`,
    );
    return result.data;
  }

  public static async UpdateApplicationStatus(
    id: string,
    status: string,
  ): Promise<ServiceResult<FetchJobApplicationDto>> {
    let result = await api.put<ServiceResult<FetchJobApplicationDto>>(
      `${this.ApiUrl}/update-status/${id}`,
      { Status: status },
    );
    return result.data;
  }
}
