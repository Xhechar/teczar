import type { IService } from "../contracts/abstruct.js";
import { BaseService } from "../contracts/base.contract.js";
import type { CreateJobDto, FetchJobDto, UpdateJobDto } from "../dto/dto.js";
import { ErrorType, SocketTypes } from "../enums/enums.js";
import type { Job } from "../generated/prisma/browser.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import type { ServiceResult } from "../interfaces/result/service.result.js";
import { prisma } from "../lib/prisma.js";
import { io } from "../server.js";
import { CreateJobValidator, UpdateJobValidator } from "../validators/validators.js";

export class JobService extends BaseService implements IService<FetchJobDto, CreateJobDto, UpdateJobDto> {
  async Create(UserId: string, data: CreateJobDto): Promise<ServiceResult<FetchJobDto>> {
    
    let { error } = CreateJobValidator.validate(data);
    
    if (error) {
      return ServiceResponse.Failure<FetchJobDto>(
        ErrorType.VALIDATION,
        error.details[0]?.message as string,
      );
    }

    let createJob = await prisma.job.create({
      data,
    });

    if (!createJob) {
      return ServiceResponse.Failure<FetchJobDto>(
        ErrorType.SERVER,
        "Unable to submit application at the moment.",
      );
    }

    io.emit(SocketTypes.joc);

    return ServiceResponse.Success<FetchJobDto>(
      "Job created successfully.",
    );
  }
  async Update(id: string, data: UpdateJobDto): Promise<ServiceResult<FetchJobDto>> {

    let JobExists = await prisma.job.findUnique({
      where: {
        JobId: id
      }
    });
    
    if (!JobExists) {
      return ServiceResponse.Failure<FetchJobDto>(
        ErrorType.NOTFOUND,
        "Job specified not found",
      );
    }
    
    let { error } = UpdateJobValidator.validate(data);

    if (error) {
      return ServiceResponse.Failure<FetchJobDto>(
        ErrorType.VALIDATION,
        error.details[0]?.message as string,
      );
    }

    let updateJob = await prisma.job.update({
      data,
      where: {
        JobId: JobExists.JobId
      }
    });

    if (!updateJob) {
      return ServiceResponse.Failure<FetchJobDto>(
        ErrorType.SERVER,
        "Unable to submit application at the moment.",
      );
    }

    io.emit(SocketTypes.jou);

    return ServiceResponse.Success<FetchJobDto>("Job updated successfully.");
  }
  async Delete(id: string): Promise<ServiceResult<FetchJobDto>> {
    let JobExists = await prisma.job.findUnique({
      where: {
        JobId: id,
      },
      include: {
        Applications: true
      }
    });

    if (!JobExists) {
      return ServiceResponse.Failure<FetchJobDto>(
        ErrorType.NOTFOUND,
        "Job specified not found",
      );
    };

    if (JobExists.Applications.length > 0) {
      return ServiceResponse.Failure<FetchJobDto>(
        ErrorType.NOTFOUND,
        "Cannot delete job with submitted applications",
      );
    }

    let deleteJob = await prisma.job.delete({
      where: {
        JobId: JobExists.JobId,
      },
    });

    if (!deleteJob) {
      return ServiceResponse.Failure<FetchJobDto>(
        ErrorType.SERVER,
        "Unable to delete job at the moment.",
      );
    }

    io.emit(SocketTypes.jod);

    return ServiceResponse.Success<FetchJobDto>("Job deleted successfully.");
  }
  async FetchById(id: string): Promise<ServiceResult<FetchJobDto>> {
    let JobExists = await prisma.job.findUnique({
      where: {
        JobId: id,
      },
      include: {
        Applications: true,
      },
    });

    if (!JobExists) {
      return ServiceResponse.Failure<FetchJobDto>(
        ErrorType.NOTFOUND,
        "Job specified not found",
      );
    }

    return ServiceResponse.Success<FetchJobDto>("Job fetched successfully.", {
      JobId: JobExists.JobId,
      Title: JobExists.Title,
      Description: JobExists.Description,
      Location: JobExists.Location,
      SalaryRange: JobExists.SalaryRange as string,
      EmploymentType: JobExists.EmploymentType,
      IsActive: JobExists.IsActive
    });
  }
  async FetchAll(): Promise<ServiceResult<FetchJobDto>> {
    let JobExists = await prisma.job.findMany();

    if (!JobExists) {
      return ServiceResponse.Failure<FetchJobDto>(
        ErrorType.NOTFOUND,
        "Job(s) specified not found",
      );
    }

    return ServiceResponse.Success<FetchJobDto>(
      "Job(s) fetched successfully.",
      undefined,
      JobExists.map((j) => ({
        JobId: j.JobId,
        Title: j.Title,
        Description: j.Description,
        Location: j.Location,
        SalaryRange: j.SalaryRange as string,
        EmploymentType: j.EmploymentType,
        IsActive: j.IsActive,
      })),
    );
  }
  async FetchActive(): Promise<ServiceResult<FetchJobDto>> {
    let JobExists = await prisma.job.findMany({
      where: {
        IsActive: true,
      }
    });

    if (!JobExists) {
      return ServiceResponse.Failure<FetchJobDto>(
        ErrorType.NOTFOUND,
        "Job(s) specified not found",
      );
    }

    return ServiceResponse.Success<FetchJobDto>(
      "Job(s) fetched successfully.",
      undefined,
      JobExists.map((j) => ({
        JobId: j.JobId,
        Title: j.Title,
        Description: j.Description,
        Location: j.Location,
        SalaryRange: j.SalaryRange as string,
        EmploymentType: j.EmploymentType,
        IsActive: j.IsActive,
      })),
    );
  }
  async SoftDelete(id: string): Promise<ServiceResult<FetchJobDto>> {
    let JobExists = await prisma.job.findUnique({
      where: {
        JobId: id,
      },
      include: {
        Applications: true,
      },
    });

    if (!JobExists) {
      return ServiceResponse.Failure<FetchJobDto>(
        ErrorType.NOTFOUND,
        "Job specified not found",
      );
    }

    let updateJob = await prisma.job.update({
      where: {
        JobId: id,
      },
      data: {
        IsActive: !JobExists.IsActive
      }
    });

    if (!updateJob) {
      return ServiceResponse.Failure<FetchJobDto>(
        ErrorType.SERVER,
        "Unable to update job at the moment.",
      );
    }

    io.emit(SocketTypes.jou);

    return ServiceResponse.Success<FetchJobDto>("Job updated successfully.");
  }
  
}