import type { UserRole } from "../../enums/enums.js";

export interface ServiceResult<T> {
  Success: boolean;
  Title: string;
  SuccessMessage?: string | undefined;
  ErrorMessage?: string | undefined;
  Data?: T | undefined;
  DataList?: T[] | undefined;
  AccessToken?: string | undefined;
  RefreshToken?: string | undefined;
  Role?: UserRole | undefined;
}