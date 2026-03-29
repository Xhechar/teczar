import type { MediaType, ReviewStatus } from "../enums/enums.js";

export interface CreateProductDto {
  Name: string;
  Description: string;
  Price: number;
  OfferPrice?: number;
  OnOffer?: boolean;
  Quantity: number;
  CategoryId: string;
  IsFeatured?: boolean;
  IsAvailable?: boolean;
  ImageUrls: string[];
}

export interface UpdateProductDto {
  Name?: string;
  Description?: string;
  Price?: number;
  OfferPrice?: number;
  OnOffer?: boolean;
  Quantity?: number;
  CategoryId?: string;
  IsFeatured?: boolean;
  IsAvailable?: boolean;
}

export interface FetchProductDto {
  ProductId: string;
  Name: string;
  Description: string;
  Price: number;
  OfferPrice?: number;
  OnOffer: boolean;
  Quantity: number;
  IsFeatured: boolean;
  IsAvailable: boolean;
  Images?: string[];
  Category?: {
    CategoryId: string;
    Name: string;
  };
  Reviews?: {
    ReviewId: string;
    Rating: number;
    Message: string;
    User?: {
      FirstName: string;
      SecondName: string;
      Email: string;
      Country: string;
    };
  }[];
}

export interface CreateCategoryDto {
  Name: string;
  ImageUrl?: string;
}

export interface UpdateCategoryDto {
  Name?: string;
  ImageUrl?: string;
}

export interface FetchCategoryDto {
  CategoryId: string;
  Name: string;
  ImageUrl?: string;
}

export interface CreateProductImageDto {
  ProductId: string;
  ImageUrl: string;
}

export interface UpdateProductImageDto {
  ImageUrl?: string;
}

export interface FetchProductImageDto {
  ImageId: string;
  ImageUrl: string;
}

export interface CreateServiceDto {
  Title: string;
  Description: string;
  ImageUrl: string;
  OnOffer?: boolean;
  IsFeatured?: boolean;
}

export interface UpdateServiceDto {
  Title?: string;
  Description?: string;
  ImageUrl?: string;
  OnOffer?: boolean;
  IsFeatured?: boolean;
}

export interface FetchServiceDto {
  ServiceId: string;
  Title: string;
  Description: string;
  ImageUrl?: string;
  OnOffer: boolean;
  IsFeatured: boolean;
}

export interface CreateServiceRequestDto {
  ServiceId: string;
  PreferredDate: Date;
  LocationDescription: string;
}

export interface UpdateServiceRequestDto {
  PreferredDate?: Date;
  LocationDescription?: string;
}

export interface FetchServiceRequestDto {
  RequestId: string;
  Service: {
    ServiceId: string;
    Title: string;
  };
  PreferredDate?: Date;
  LocationDescription?: string;
  Status: string;
  CreatedAt: Date;
  User: {
    FirstName: string;
    SecondName: string;
    Phone: string;
  };
}

export interface CreateUserDto {
  FirstName: string;
  SecondName: string;
  Email: string;
  Phone: string;
  County: string;
  LocationDescription?: string;
  Password: string;
}

export interface UpdateUserDto {
  FirstName?: string;
  SecondName?: string;
  County?: string;
  LocationDescription?: string;
}

export interface FetchUserDto {
  UserId: string;
  FirstName: string;
  SecondName: string;
  Email: string;
  Phone: string;
  County: string;
  LocationDescription?: string;
  Role: string;
  IsActive: boolean;
  CreatedAt: Date;
}

export interface FetchCartDto {
  CartId: string;
  Items: {
    CartItemId: string;
    ProductId: string;
    Name: string;
    Price: number;
    Quantity: number;
    Image?: string;
    Category: string;
  }[];
}

export interface CreateCartItemDto {
  ProductId: string;
  Quantity: number;
}

export interface UpdateCartItemDto {
  Quantity: number;
}

export interface CreateOrderDto {
  CartId: string;
}

export interface FetchOrderDto {
  OrderId: string;
  Status: string;
  TotalAmount: number;
  Items: {
    OrderItemId: string;
    ProductId: string;
    Name: string;
    Quantity: number;
    PriceAtPurchase: number;
    Product: {
      Name: string;
      Category: {
        CategoryId: string;
        Name: string;
      };
      Reviews?: {
        ReviewId: string;
        Rating: number;
        Message: string;
      }[];
    };
  }[];
  CreatedAt: Date;
  User: {
    FirstName: string;
    SecondName: string;
    Phone: string;
    Email: string;
    County: string;
  };
}

export interface CreatePaymentDto {
  OrderId: string;
}

export interface FetchPaymentDto {
  UserId: string;
  PaymentId: string;
  OrderId: string;
  Amount: number;
  MpesaReferenceCode?: string;
  Status: string;
  CreatedAt: Date;
  User: {
    UserId: string;
    FirstName: string;
    SecondName: string;
  };
}

export interface CreateReviewDto {
  ProductId: string;
  OrderId: string;
  Rating: number;
  Message: string;
}

export interface UpdateReviewDto {
  Rating?: number;
  Message?: string;
}

export interface FetchReviewDto {
  ReviewId: string;
  Rating: number;
  Message?: string;
  Status: ReviewStatus;
  User: {
    FirstName: string;
    SecondName: string;
    Email: string;
  };
  CreatedAt: Date;
}

export interface CreateAdvertDto {
  MediaUrl: string;
  MediaType: MediaType;
  Title: string;
}

export interface UpdateAdvertDto {
  MediaUrl?: string;
  MediaType?: MediaType;
  Title?: string;
  IsActive?: boolean;
}

export interface FetchAdvertDto {
  AdvertId: string;
  MediaUrl: string;
  MediaType: MediaType;
  Title: string;
  IsActive: boolean;
}

export interface CreateJobDto {
  Title: string;
  Description: string;
  Location: string;
  SalaryRange?: string;
  EmploymentType: string;
}

export interface UpdateJobDto {
  Title?: string;
  Description?: string;
  Location?: string;
  SalaryRange?: string;
  IsActive?: boolean;
}

export interface FetchJobDto {
  JobId: string;
  Title: string;
  Description: string;
  Location?: string;
  SalaryRange?: string;
  EmploymentType: string;
  IsActive: boolean;
}

export interface CreateJobApplicationDto {
  JobId: string;
  FullName: string;
  Email: string;
  Phone: string;
  ResumeUrl?: string;
  CoverLetter?: string;
}

export interface FetchJobApplicationDto {
  ApplicationId: string;
  JobId: string;
  FullName: string;
  Email: string;
  Phone: string;
  Status: string;
  CreatedAt: Date;
}

export interface ResetPasswordDto {
  Email: string;
  ResetCode: number;
  NewPassword: string;
}

export interface ChangePasswordDto {
  OldPassword: string;
  NewPassword: string;
}

export interface LoginDto {
  Email: string;
  Password: string;
}

export interface CreateHeroSlideDto {
  ImageUrl: string;
  Tag: string;
  Title: string;
  TitleAccent: string;
  Description: string;
  CtaLabel: string;
  CtaLink: string;
  SortOrder: number;
  IsActive: boolean;
}

export type UpdateHeroSlideDto = Partial<CreateHeroSlideDto>;