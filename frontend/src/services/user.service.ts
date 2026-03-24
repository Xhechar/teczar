import { api } from "../middleware/middleware";
import { ServiceResult } from "../interfaces/result/service.result";
import { CreateUserDto, FetchUserDto, UpdateUserDto } from "../dtos/dto";
import { User } from "../interfaces/interfaces.js";

export class UserService {
  private static readonly ApiUrl = "user";

  static async Create(
    payload: CreateUserDto,
  ): Promise<ServiceResult<FetchUserDto>> {
    const result = await api.post<ServiceResult<FetchUserDto>>(
      `${this.ApiUrl}/create`,
      payload,
    );
    return result.data;
  }

  static async Update(
    payload: UpdateUserDto,
  ): Promise<ServiceResult<FetchUserDto>> {
    const result = await api.put<ServiceResult<FetchUserDto>>(
      `${this.ApiUrl}/update`,
      payload,
    );
    return result.data;
  }

  static async AdminUpdate(
    id: string, 
    payload: UpdateUserDto,
  ): Promise<ServiceResult<FetchUserDto>> {
    const result = await api.put<ServiceResult<FetchUserDto>>(
      `${this.ApiUrl}/admin-update/${id}`,
      payload,
    );
    return result.data;
  }

  static async Delete(id: string): Promise<ServiceResult<boolean>> {
    const result = await api.delete<ServiceResult<boolean>>(
      `${this.ApiUrl}/delete/${id}`,
    );
    return result.data;
  }

  static async FetchById(): Promise<ServiceResult<FetchUserDto>> {
    const result = await api.get<ServiceResult<FetchUserDto>>(
      `${this.ApiUrl}/get`,
    );
    return result.data;
  }

  static async FetchAll(): Promise<ServiceResult<User>> {
    const result = await api.get<ServiceResult<User>>(`${this.ApiUrl}/get-all`);
    return result.data;
  }

  static async ToggleActivate(
    id: string,
  ): Promise<ServiceResult<FetchUserDto>> {
    const result = await api.patch<ServiceResult<FetchUserDto>>(
      `${this.ApiUrl}/toggle-activate/${id}`,
    );
    return result.data;
  }
}
