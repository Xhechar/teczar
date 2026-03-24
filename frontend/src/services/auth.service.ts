import { LoginDto, ResetPasswordDto, ChangePasswordDto, FetchUserDto } from "../dtos/dto";
import { ServiceResult } from "../interfaces/result/service.result";
import { api } from "../middleware/middleware";

export class AuthService {
  private static readonly ApiUrl = `auth`;

  public static async LoginUser(dto: LoginDto): Promise<ServiceResult<object>> {
    const result = await api.post<ServiceResult<object>>(
      `${this.ApiUrl}/login`,
      dto,
    );
    return result.data;
  }

  public static async RefreshToken(): Promise<ServiceResult<object>> {
    const result = await api.post<ServiceResult<object>>(
      `${this.ApiUrl}/refresh`,
      {},
    );
    return result.data;
  }

  public static async VerifyMail(
    email: string,
  ): Promise<ServiceResult<object>> {
    const result = await api.post<ServiceResult<object>>(
      `${this.ApiUrl}/verify-mail`,
      { Email: email },
    );
    return result.data;
  }

  public static async ResetPassword(
    dto: ResetPasswordDto,
  ): Promise<ServiceResult<object>> {
    const result = await api.post<ServiceResult<object>>(
      `${this.ApiUrl}/reset-password`,
      dto,
    );
    return result.data;
  }

  public static async ChangePassword(
    dto: ChangePasswordDto,
  ): Promise<ServiceResult<object>> {
    const result = await api.post<ServiceResult<object>>(
      `${this.ApiUrl}/change-password`,
      dto,
    );
    return result.data;
  }

  public static async LogoutUser(): Promise<ServiceResult<object>> {
    const result = await api.post<ServiceResult<object>>(
      `${this.ApiUrl}/logout`,
      {},
    );
    return result.data;
  }

  public static async IsAuthenticated(): Promise<ServiceResult<FetchUserDto>> {
    const result = await api.get<ServiceResult<FetchUserDto>>(
      `${this.ApiUrl}/is-authenticated`,
    );
    return result.data;
  }
}
