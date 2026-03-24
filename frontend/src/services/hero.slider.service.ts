import { api } from "../middleware/middleware";
import { ServiceResult } from "../interfaces/result/service.result";
import { HeroSlide } from "../interfaces/interfaces.js";
import { CreateHeroSlideDto, UpdateHeroSlideDto } from "../dtos/dto";

export class HeroSliderService {
  private static readonly ApiUrl = "hero-slider";

  static async Create(
    payload: CreateHeroSlideDto,
  ): Promise<ServiceResult<HeroSlide>> {
    const result = await api.post<ServiceResult<HeroSlide>>(
      `${this.ApiUrl}/create`,
      payload,
    );
    return result.data;
  }

  static async Update(
    id: string,
    payload: UpdateHeroSlideDto,
  ): Promise<ServiceResult<HeroSlide>> {
    const result = await api.put<ServiceResult<HeroSlide>>(
      `${this.ApiUrl}/update/${id}`,
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

  static async ToggleActive(id: string): Promise<ServiceResult<HeroSlide>> {
    const result = await api.patch<ServiceResult<HeroSlide>>(
      `${this.ApiUrl}/toggle-active/${id}`,
    );
    return result.data;
  }

  static async FetchAll(): Promise<ServiceResult<HeroSlide>> {
    const result = await api.get<ServiceResult<HeroSlide>>(
      `${this.ApiUrl}/get-all`,
    );
    return result.data;
  }

  static async FetchActive(): Promise<ServiceResult<HeroSlide>> {
    const result = await api.get<ServiceResult<HeroSlide>>(
      `${this.ApiUrl}/get-active`,
    );
    return result.data;
  }
}
