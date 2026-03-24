import { CreateReviewDto, FetchReviewDto, UpdateReviewDto } from "../dtos/dto";
import { Review } from "../interfaces/interfaces";
import { ServiceResult } from "../interfaces/result/service.result";
import { api } from "../middleware/middleware";

export class ReviewService {
  private static readonly ApiUrl = "review";

  public static async Create(
    payload: CreateReviewDto,
  ): Promise<ServiceResult<FetchReviewDto>> {
    let result = await api.post<ServiceResult<FetchReviewDto>>(
      `${this.ApiUrl}/create`,
      payload,
    );
    return result.data;
  }

  public static async Update(
    id: string,
    payload: UpdateReviewDto,
  ): Promise<ServiceResult<FetchReviewDto>> {
    let result = await api.put<ServiceResult<FetchReviewDto>>(
      `${this.ApiUrl}/update/${id}`,
      payload,
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
  ): Promise<ServiceResult<FetchReviewDto>> {
    let result = await api.get<ServiceResult<FetchReviewDto>>(
      `${this.ApiUrl}/get/${id}`,
    );
    return result.data;
  }

  public static async FetchByUser(): Promise<ServiceResult<FetchReviewDto>> {
    let result = await api.get<ServiceResult<FetchReviewDto>>(
      `${this.ApiUrl}/get-by-user`,
    );
    return result.data;
  }

  public static async FetchAll(): Promise<ServiceResult<Review>> {
    let result = await api.get<ServiceResult<Review>>(
      `${this.ApiUrl}/get-all`,
    );
    return result.data;
  }

  public static async FetchApproved(): Promise<
    ServiceResult<FetchReviewDto>
  > {
    let result = await api.get<ServiceResult<FetchReviewDto>>(
      `${this.ApiUrl}/get-approved`,
    );
    return result.data;
  }

  public static async UpdateStatus(
    id: string,
    status: string,
  ): Promise<ServiceResult<FetchReviewDto>> {
    let result = await api.put<ServiceResult<FetchReviewDto>>(
      `${this.ApiUrl}/update-status/${id}`,
      { Status: status },
    );
    return result.data;
  }
}
