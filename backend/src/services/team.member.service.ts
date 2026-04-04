import type { IService } from "../contracts/abstruct.js";
import { BaseService } from "../contracts/base.contract.js";
import type { FetchTeamMemberDto, CreateTeamMemberDto, UpdateTeamMemberDto } from "../dto/dto.js";
import { ErrorType, SocketTypes } from "../enums/enums.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import type { ServiceResult } from "../interfaces/result/service.result.js";
import { prisma } from "../lib/prisma.js";
import { io } from "../server.js";
import { CreateTeamMemberValidator, UpdateTeamMemberValidator } from "../validators/validators.js";

export class TeamMemberService extends BaseService implements IService<FetchTeamMemberDto, CreateTeamMemberDto, UpdateTeamMemberDto> {
  async Create(UserId: string, data: CreateTeamMemberDto): Promise<ServiceResult<FetchTeamMemberDto>> {
    
    let { error } = CreateTeamMemberValidator.validate(data);

    if(error) {
      return ServiceResponse.Failure<FetchTeamMemberDto>(
        ErrorType.VALIDATION,
        error.details[0]?.message as string,
      );
    }

    let teamMemberExist = await prisma.teamMember.findFirst({
      where: {
        Name: data.Name,
        Role: data.Role,
      },
    });

    if (teamMemberExist) {
      return ServiceResponse.Failure<FetchTeamMemberDto>(
        ErrorType.DUPLICATE,
        "A team member with the same name and role already exists.",
      );
    }

    let create = await prisma.teamMember.create({
      data
    });

    if (!create) {
      return ServiceResponse.Failure<FetchTeamMemberDto>(
        ErrorType.SERVER,
        "Unable to create team member at the moment.",
      );
    }

    io.emit(SocketTypes.tmc);

    return ServiceResponse.Success<FetchTeamMemberDto>(
      "Team member created successfully.",
    );
  }
  async Update(id: string, data: UpdateTeamMemberDto): Promise<ServiceResult<FetchTeamMemberDto>> {
    
    let teamMemberExist = await prisma.teamMember.findUnique({
      where: {
        MemberId: id
      }
    });

    if(!teamMemberExist) {
      return ServiceResponse.Failure<FetchTeamMemberDto>(
        ErrorType.NOTFOUND,
        "Team member not found.",
      );
    }

    let { error } = UpdateTeamMemberValidator.validate(data);

    if(error) {
      return ServiceResponse.Failure<FetchTeamMemberDto>(
        ErrorType.VALIDATION,
        error.details[0]?.message as string,
      );
    }

    let update = await prisma.teamMember.update({
      where: {
        MemberId: id
      },
      data
    });

    if (!update) {
      return ServiceResponse.Failure<FetchTeamMemberDto>(
        ErrorType.SERVER,
        "Unable to update team member at the moment.",
      );
    }

    io.emit(SocketTypes.tmu);

    return ServiceResponse.Success<FetchTeamMemberDto>(
      "Team member updated successfully.",
    );
  }
  async Delete(id: string): Promise<ServiceResult<FetchTeamMemberDto>> {

    let teamMemberExist = await prisma.teamMember.findUnique({
      where: {
        MemberId: id,
      },
    });

    if (!teamMemberExist) {
      return ServiceResponse.Failure<FetchTeamMemberDto>(
        ErrorType.NOTFOUND,
        "Team member not found.",
      );
    }

    let del = await prisma.teamMember.delete({
      where: {
        MemberId: id,
      },
    });

    if (!del) {
      return ServiceResponse.Failure<FetchTeamMemberDto>(
        ErrorType.SERVER,
        "Unable to delete team member at the moment.",
      );
    }

    io.emit(SocketTypes.tmd);

    return ServiceResponse.Success<FetchTeamMemberDto>(
      "Team member deleted successfully.",
    );
  }
  async FetchAll(): Promise<ServiceResult<FetchTeamMemberDto>> {
    
    let teamMembers = await prisma.teamMember.findMany({
      orderBy: {
        CreatedAt: "desc"
      }
    });

    if(!teamMembers) {
      return ServiceResponse.Failure<FetchTeamMemberDto>(
        ErrorType.SERVER,
        "Unable to fetch team members at the moment.",
      );
    }

    return ServiceResponse.Success<FetchTeamMemberDto>(
      "Team members fetched successfully.",
      undefined,
      teamMembers.map((member) => ({
        MemberId: member.MemberId,
        Name: member.Name,
        Role: member.Role,
        ImageUrl: member.ImageUrl,
        Bio: member.Bio,
        IsActive: member.IsActive,
        IsDeleted: member.IsDeleted,
      }))
    );
  }
}