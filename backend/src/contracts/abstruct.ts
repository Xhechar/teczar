import type { ServiceResult } from "../interfaces/result/service.result.js";

export interface IService<T, C, U> {
  Create(UserId: string, data: C): Promise<ServiceResult<T>>;

  Update(id: string, data: U, UserId?: string): Promise<ServiceResult<T>>;

  Delete(id: string, UserId?: string): Promise<ServiceResult<T>>;

  FetchById?(id: string): Promise<ServiceResult<T>>;

  FetchByUserId?(id: string): Promise<ServiceResult<T>>;

  FetchAll?(): Promise<ServiceResult<T>>;

  FetchPaged?(page: number, pageSize: number): Promise<ServiceResult<T>>;

  FetchByStatus?(status: string): Promise<ServiceResult<T>>;
}
