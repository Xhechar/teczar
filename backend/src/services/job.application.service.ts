import type { IService } from "../contracts/abstruct.js";
import { BaseService } from "../contracts/base.contract.js";
import type { CreateJobApplicationDto, FetchJobApplicationDto } from "../dto/dto.js";
import { ErrorType, JobApplicationStatus, SocketTypes } from "../enums/enums.js";
import type { User } from "../generated/prisma/browser.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import type { ServiceResult } from "../interfaces/result/service.result.js";
import { prisma } from "../lib/prisma.js";
import { io } from "../server.js";
import { CreateJobApplicationValidator } from "../validators/validators.js";

export class JobApplicationService
  extends BaseService
  implements IService<FetchJobApplicationDto, CreateJobApplicationDto, object>
{
  async Create(
    UserId: string,
    data: CreateJobApplicationDto,
  ): Promise<ServiceResult<FetchJobApplicationDto>> {
    let { error } = CreateJobApplicationValidator.validate(data);

    if (error) {
      return ServiceResponse.Failure<FetchJobApplicationDto>(
        ErrorType.VALIDATION,
        error.details[0]?.message as string,
      );
    }

    let applicationEmailExists = await prisma.jobApplication.findFirst({
      where: {
        Email: data.Email,
        JobId: data.JobId,
      },
    });

    if (applicationEmailExists) {
      return ServiceResponse.Failure<FetchJobApplicationDto>(
        ErrorType.DUPLICATE,
        "You already applied for this job posting, kindly await further communication.",
      );
    }

    let applicationPhoneExists = await prisma.jobApplication.findFirst({
      where: {
        Email: data.Phone,
        JobId: data.JobId,
      },
    });

    if (applicationPhoneExists) {
      return ServiceResponse.Failure<FetchJobApplicationDto>(
        ErrorType.DUPLICATE,
        "You already applied for this job posting, kindly await further communication.",
      );
    }

    let createApplication = await prisma.jobApplication.create({
      data,
    });

    if (!createApplication) {
      return ServiceResponse.Failure<FetchJobApplicationDto>(
        ErrorType.SERVER,
        "Unable to submit application at the moment.",
      );
    }

    io.emit(SocketTypes.jau);

    return ServiceResponse.Success<FetchJobApplicationDto>(
      "Application submitted successfully. You will be contacted via email about the next steps on shortlisting",
    );
  }
  async Delete(id: string): Promise<ServiceResult<FetchJobApplicationDto>> {
    let applicationExists = await prisma.jobApplication.findFirst({
      where: {
        ApplicationId: id,
      },
    });

    if (!applicationExists) {
      return ServiceResponse.Failure<FetchJobApplicationDto>(
        ErrorType.NOTFOUND,
        "Application specified not found.",
      );
    }

    let deleteApplication = await prisma.jobApplication.delete({
      where: {
        ApplicationId: id,
      },
    });

    if (!deleteApplication) {
      return ServiceResponse.Failure<FetchJobApplicationDto>(
        ErrorType.SERVER,
        "Unable to delete application at the moment.",
      );
    }

    io.emit(SocketTypes.jau);

    return ServiceResponse.Success<FetchJobApplicationDto>(
      "Application deleted successfully.",
    );
  }
  async FetchById(id: string): Promise<ServiceResult<FetchJobApplicationDto>> {
    let applicationExists = await prisma.jobApplication.findFirst({
      where: {
        ApplicationId: id,
      },
    });

    if (!applicationExists) {
      return ServiceResponse.Failure<FetchJobApplicationDto>(
        ErrorType.NOTFOUND,
        "Application specified not found.",
      );
    }

    return ServiceResponse.Success<FetchJobApplicationDto>(
      "Application fetched successfully.",
      {
        ApplicationId: applicationExists.ApplicationId,
        FullName: applicationExists.FullName,
        JobId: applicationExists.JobId,
        Email: applicationExists.Email,
        Phone: applicationExists.Phone,
        Status: applicationExists.Status,
        CreatedAt: applicationExists.CreatedAt,
      },
    );
  }
  async FetchByUserId(
    id: string,
  ): Promise<ServiceResult<FetchJobApplicationDto>> {
    let UserExists = await this.Exists<User>(prisma.user, "UserId", id);

    if (!UserExists) {
      return ServiceResponse.Failure<FetchJobApplicationDto>(
        ErrorType.NOTFOUND,
        "You are not allowed to access this service",
      );
    }

    let applicationExists = await prisma.jobApplication.findMany({
      where: {
        Email: UserExists.Data?.Email as string,
      },
    });

    if (!applicationExists) {
      return ServiceResponse.Failure<FetchJobApplicationDto>(
        ErrorType.NOTFOUND,
        "Applications specified not found.",
      );
    }

    return ServiceResponse.Success<FetchJobApplicationDto>(
      "Application(s) fetched successfully.",
      undefined,
      applicationExists.map((a) => ({
        ApplicationId: a.ApplicationId,
        FullName: a.FullName,
        JobId: a.JobId,
        Email: a.Email,
        Phone: a.Phone,
        Status: a.Status,
        CreatedAt: a.CreatedAt,
      })),
    );
  }
  async FetchAll(): Promise<ServiceResult<FetchJobApplicationDto>> {
    let applicationExists = await prisma.jobApplication.findMany();

    if (!applicationExists) {
      return ServiceResponse.Failure<FetchJobApplicationDto>(
        ErrorType.NOTFOUND,
        "Applications specified not found.",
      );
    }

    return ServiceResponse.Success<FetchJobApplicationDto>(
      "Application(s) fetched successfully.",
      undefined,
      applicationExists.map((a) => ({
        ApplicationId: a.ApplicationId,
        FullName: a.FullName,
        JobId: a.JobId,
        Email: a.Email,
        Phone: a.Phone,
        Status: a.Status,
        CreatedAt: a.CreatedAt,
      })),
    );
  }
  async UpdateApplicationStatus(
    id: string,
    Status: JobApplicationStatus,
  ): Promise<ServiceResult<FetchJobApplicationDto>> {
    let applicationExists = await prisma.jobApplication.findFirst({
      where: {
        ApplicationId: id,
      },
    });

    if (!applicationExists) {
      return ServiceResponse.Failure<FetchJobApplicationDto>(
        ErrorType.NOTFOUND,
        "Application specified not found.",
      );
    }

    let updateStatus = await prisma.jobApplication.update({
      where: {
        ApplicationId: id
      },
      data: {
        Status
      }
    });

    if (!updateStatus) {
      return ServiceResponse.Failure<FetchJobApplicationDto>(
        ErrorType.SERVER,
        "Unable to update application status at the moment.",
      );
    }

    io.emit(SocketTypes.jau);

    return ServiceResponse.Success<FetchJobApplicationDto>(
      "Application status updated successfully.",
    );
  }
  async Update(
    id: string,
    data: object,
    UserId?: string,
  ): Promise<ServiceResult<FetchJobApplicationDto>> {
    throw new Error("Method not implemented.");
  }
}