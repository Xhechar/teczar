import type { IService } from "../contracts/abstruct.js";
import { BaseService } from "../contracts/base.contract.js";
import type { CreateReviewDto, FetchReviewDto, UpdateReviewDto } from "../dto/dto.js";
import { ErrorType, OrderStatus, ReviewStatus, SocketTypes } from "../enums/enums.js";
import type { User } from "../generated/prisma/browser.js";
import { ServiceResponse } from "../interfaces/repository/service.response.js";
import type { ServiceResult } from "../interfaces/result/service.result.js";
import { prisma } from "../lib/prisma.js";
import { io } from "../server.js";
import { CreateReviewValidator, UpdateReviewValidator } from "../validators/validators.js";

export class ReviewService
  extends BaseService
  implements IService<FetchReviewDto, CreateReviewDto, UpdateReviewDto>
{
  async Create(
    UserId: string,
    data: CreateReviewDto,
  ): Promise<ServiceResult<FetchReviewDto>> {
    let UserExists = await this.Exists<User>(prisma.user, "UserId", UserId);

    if (!UserExists.Success && !UserExists.Data) {
      return ServiceResponse.Failure<FetchReviewDto>(
        ErrorType.NOTFOUND,
        "You are not allowed to access this service",
      );
    }

    let orderExists = await prisma.orderItem.findFirst({
      where: {
        ProductId: data.ProductId
      },
      include: {
        Order: true
      }
    });

    if(!orderExists) {
      return ServiceResponse.Failure<FetchReviewDto>(
        ErrorType.SERVER,
        "You can only submit a review for this product if you ordered it.",
      );
    }

    if (orderExists.Order.Status !== OrderStatus.Delivered) {
      return ServiceResponse.Failure<FetchReviewDto>(
        ErrorType.SERVER,
        "You can only submit a review after you product has been delivered.",
      );
    }

    let { error } = CreateReviewValidator.validate(data);

    if (error) {
      return ServiceResponse.Failure<FetchReviewDto>(
        ErrorType.VALIDATION,
        error.details[0]?.message as string,
      );
    }

    let create = await prisma.review.create({
      data: {
        UserId,
        ...data,
      },
    });

    if (!create) {
      return ServiceResponse.Failure<FetchReviewDto>(
        ErrorType.SERVER,
        "Unable to create the review at the moment.",
      );
    }

    io.emit(SocketTypes.rec);

    return ServiceResponse.Success<FetchReviewDto>(
      "Review created successfully.",
    );
  }
  async Update(
    id: string,
    data: UpdateReviewDto,
  ): Promise<ServiceResult<FetchReviewDto>> {
    let reviewExists = await prisma.review.findUnique({
      where: {
        ReviewId: id,
      },
    });

    if (!reviewExists) {
      return ServiceResponse.Failure<FetchReviewDto>(
        ErrorType.NOTFOUND,
        "The review specified not found.",
      );
    }

    let { error } = UpdateReviewValidator.validate(data);

    if (error) {
      return ServiceResponse.Failure<FetchReviewDto>(
        ErrorType.VALIDATION,
        error.details[0]?.message as string,
      );
    }

    let updateReview = await prisma.review.update({
      where: {
        ReviewId: id,
      },
      data,
    });

    if (!updateReview) {
      return ServiceResponse.Failure<FetchReviewDto>(
        ErrorType.SERVER,
        "Unable to update review at the moment.",
      );
    }

    io.emit(SocketTypes.reu);

    return ServiceResponse.Success<FetchReviewDto>(
      "Review updated successfully.",
    );
  }
  async Delete(id: string): Promise<ServiceResult<FetchReviewDto>> {
    let reviewExists = await prisma.review.findUnique({
      where: {
        ReviewId: id,
      },
    });

    if (!reviewExists) {
      return ServiceResponse.Failure<FetchReviewDto>(
        ErrorType.NOTFOUND,
        "The review specified not found.",
      );
    }

    let deleteReview = await prisma.review.delete({
      where: {
        ReviewId: id,
      },
    });

    if (!deleteReview) {
      return ServiceResponse.Failure<FetchReviewDto>(
        ErrorType.SERVER,
        "Unable to delete review at the moment.",
      );
    }

    io.emit(SocketTypes.red);

    return ServiceResponse.Success<FetchReviewDto>(
      "Review deleted successfully.",
    );
  }
  async FetchById(id: string): Promise<ServiceResult<FetchReviewDto>> {
    let reviewExists = await prisma.review.findUnique({
      where: {
        ReviewId: id,
      },
      include: {
        User: true,
      },
    });

    if (!reviewExists) {
      return ServiceResponse.Failure<FetchReviewDto>(
        ErrorType.NOTFOUND,
        "The review specified not found.",
      );
    }

    return ServiceResponse.Success<FetchReviewDto>(
      "Review deleted successfully.",
      {
        ReviewId: reviewExists.ReviewId,
        Rating: reviewExists.Rating,
        Message: reviewExists.Message,
        Status: reviewExists.Status as ReviewStatus,
        User: {
          FirstName: reviewExists.User.FirstName,
          SecondName: reviewExists.User.SecondName,
          Email: reviewExists.User.Email,
        },
        CreatedAt: reviewExists.CreatedAt,
      },
    );
  }
  async FetchByUserId(id: string): Promise<ServiceResult<FetchReviewDto>> {
    let reviewExists = await prisma.review.findMany({
      where: {
        UserId: id,
      },
      include: {
        User: true,
      },
    });

    if (!reviewExists) {
      return ServiceResponse.Failure<FetchReviewDto>(
        ErrorType.NOTFOUND,
        "The review specified not found.",
      );
    }

    return ServiceResponse.Success<FetchReviewDto>(
      "Review deleted successfully.",
      undefined,
      reviewExists.map((r) => ({
        ReviewId: r.ReviewId,
        Rating: r.Rating,
        Message: r.Message,
        Status: r.Status as ReviewStatus,
        User: {
          FirstName: r.User.FirstName,
          SecondName: r.User.SecondName,
          Email: r.User.Email,
        },
        CreatedAt: r.CreatedAt,
      })),
    );
  }
  async FetchAll(): Promise<ServiceResult<FetchReviewDto>> {
    let reviewExists = await prisma.review.findMany({
      include: {
        User: true,
      },
      orderBy: {
        CreatedAt: "desc"
      }
    });

    if (!reviewExists) {
      return ServiceResponse.Failure<FetchReviewDto>(
        ErrorType.NOTFOUND,
        "The review specified not found.",
      );
    }

    return ServiceResponse.Success<FetchReviewDto>(
      "Review deleted successfully.",
      undefined,
      reviewExists.map((r) => ({
        ReviewId: r.ReviewId,
        Rating: r.Rating,
        Message: r.Message,
        Status: r.Status as ReviewStatus,
        User: {
          FirstName: r.User.FirstName,
          SecondName: r.User.SecondName,
          Email: r.User.Email,
        },
        CreatedAt: r.CreatedAt,
      })),
    );
  }
  async FetchApproved(): Promise<ServiceResult<FetchReviewDto>> {
    let reviewExists = await prisma.review.findMany({
      where: {
        Status: ReviewStatus.Approved,
      },
      include: {
        User: true,
      },
      orderBy: {
        CreatedAt: "desc",
      },
    });

    if (!reviewExists) {
      return ServiceResponse.Failure<FetchReviewDto>(
        ErrorType.NOTFOUND,
        "The review specified not found.",
      );
    }

    return ServiceResponse.Success<FetchReviewDto>(
      "Review deleted successfully.",
      undefined,
      reviewExists.map((r) => ({
        ReviewId: r.ReviewId,
        Rating: r.Rating,
        Message: r.Message,
        Status: r.Status as ReviewStatus,
        User: {
          FirstName: r.User.FirstName,
          SecondName: r.User.SecondName,
          Email: r.User.Email,
        },
        CreatedAt: r.CreatedAt,
      })),
    );
  }
  async UpdateStatus(
    id: string,
    status: ReviewStatus,
  ): Promise<ServiceResult<FetchReviewDto>> {
    let reviewExists = await prisma.review.findUnique({
      where: {
        ReviewId: id,
      },
    });

    if (!reviewExists) {
      return ServiceResponse.Failure<FetchReviewDto>(
        ErrorType.NOTFOUND,
        "The review specified not found.",
      );
    }

    let updateReview = await prisma.review.update({
      where: {
        ReviewId: id,
      },
      data: {
        Status: status
      },
    });

    if (!updateReview) {
      return ServiceResponse.Failure<FetchReviewDto>(
        ErrorType.SERVER,
        "Unable to update review at the moment.",
      );
    }

    io.emit(SocketTypes.reu);

    return ServiceResponse.Success<FetchReviewDto>(
      "Review updated successfully.",
    );
  }
}