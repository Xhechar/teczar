import { ErrorType } from "../enums/enums.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import type { ServiceResult } from "../interfaces/result/service.result.js";

export abstract class BaseService {
  protected async Exists<T>(
    model: any,
    idField: string,
    id: string,
    include?: any
  ): Promise<ServiceResult<T>> {
    try {
      const entity = await model.findFirst({
        where: {
          [idField]: id,
          IsDeleted: false,
        },
        include
      });

      return ServiceResponse.Success<T>(
        entity ? "Record exists" : "Record not found",
        entity,
      );
    } catch {
      return ServiceResponse.Failure(ErrorType.SERVER, "Error checking record existence");
    }
  }

  protected async GetByStatus<T>(model: any, idField: string, status: string, include?: any) {
    try {
      const entities = await model.findMany({
        where: {
          Status: status,
          IsDeleted: false
        },
        include,
      });

      return ServiceResponse.Success<T>(
        "Records fetched successfully",
        undefined,
        entities,
      );
    } catch (error) {
      return ServiceResponse.Failure(
        ErrorType.SERVER,
        "Error fetching records",
      );
    }
  }

  protected async GetById<T>(
    model: any,
    idField: string,
    id: string,
    include?: any,
  ): Promise<ServiceResult<T>> {
    try {
      const entity = await model.findFirst({
        where: {
          [idField]: id,
          IsDeleted: false,
        },
        include,
      });

      if (!entity) {
        return ServiceResponse.Failure(ErrorType.NOTFOUND, "Record not found");
      }

      return ServiceResponse.Success("Record fetched successfully", entity);
    } catch {
      return ServiceResponse.Failure(ErrorType.SERVER, "Error fetching record");
    }
  }

  protected async GetAll<T>(
    model: any,
    include?: any,
  ): Promise<ServiceResult<T>> {
    try {
      const entities = await model.findMany({
        where: {
          IsDeleted: false,
        },
        include,
      });

      return ServiceResponse.Success<T>(
        "Records fetched successfully",
        undefined,
        entities,
      );
    } catch {
      return ServiceResponse.Failure(ErrorType.SERVER, "Error fetching records");
    }
  }

  protected async GetPaged<T>(
    model: any,
    page: number,
    pageSize: number,
    include?: any,
  ): Promise<ServiceResult<T>> {
    try {
      const skip = (page - 1) * pageSize;

      const entities = await model.findMany({
        where: {
          IsDeleted: false,
        },
        skip,
        take: pageSize,
        include,
      });

      return ServiceResponse.Success<T>(
        "Records fetched successfully",
        undefined,
        entities,
      );
    } catch {
      return ServiceResponse.Failure<T>(ErrorType.SERVER, "Error fetching paged records");
    }
  }

  protected async HandleSoftDelete(
    model: any,
    idField: string,
    id: string,
  ): Promise<ServiceResult<object>> {
    try {
      await model.update({
        where: {
          [idField]: id,
        },
        data: {
          IsDeleted: true,
          UpdatedAt: new Date(),
        },
      });

      return ServiceResponse.Success("Record deleted successfully");
    } catch {
      return ServiceResponse.Failure<object>(ErrorType.SERVER, "Error deleting record");
    }
  }
}
