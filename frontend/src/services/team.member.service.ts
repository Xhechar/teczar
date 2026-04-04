import { CreateTeamMemberDto, FetchTeamMemberDto, UpdateTeamMemberDto } from "../dtos/dto";
import { ServiceResult } from "../interfaces/result/service.result";
import { api } from "../middleware/middleware";

export class TeamMemberService {
  private static readonly ApiUrl = "team-member";

  public static async Create(
    teamMember: CreateTeamMemberDto
  ): Promise<ServiceResult<FetchTeamMemberDto>> {
    let result = await api.post<ServiceResult<FetchTeamMemberDto>>(
      `${this.ApiUrl}/create`,
      teamMember
    );
    return result.data;
  }

  public static async Update(
    id: string,
    teamMember: UpdateTeamMemberDto
  ): Promise<ServiceResult<FetchTeamMemberDto>> {
    let result = await api.put<ServiceResult<FetchTeamMemberDto>>(
      `${this.ApiUrl}/update/${id}`,
      teamMember
    );
    return result.data;
  }

  public static async Delete(
    id: string
  ): Promise<ServiceResult<boolean>> {
    let result = await api.delete<ServiceResult<boolean>>(
      `${this.ApiUrl}/delete/${id}`
    );
    return result.data;
  }

  public static async FetchAll(): Promise<
    ServiceResult<FetchTeamMemberDto>
  > {
    let result = await api.get<ServiceResult<FetchTeamMemberDto>>(
      `${this.ApiUrl}/get-all`
    );
    return result.data;
  }
}