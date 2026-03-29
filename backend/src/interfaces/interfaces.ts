import type {
  JobApplicationStatus,
  MediaType,
  OrderStatus,
  PaymentStatus,
  ReviewStatus,
  ServiceRequestStatus,
  UserRole,
} from "../enums/enums.js";

export interface TokenDetails {
  UserId: string;
  Role: UserRole;
}

export interface Product {
  ProductId: string;
  Name: string;
  Description: string;
  Price: number;
  OfferPrice?: number;
  OnOffer: boolean;
  Quantity: number;
  CategoryId: string;
  IsFeatured: boolean;
  IsAvailable: boolean;

  Category?: Category;
  Images?: ProductImage[];
  OrderItems?: OrderItem[];
  CartItems?: CartItem[];
  Reviews?: Review[];

  IsDeleted: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface ProductImage {
  ImageId: string;
  ProductId: string;
  ImageUrl: string;

  Product?: Product;

  IsDeleted: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface Service {
  ServiceId: string;
  Title: string;
  Description: string;
  ImageUrl?: string;
  OnOffer: boolean;
  IsFeatured: boolean;

  Requests?: ServiceRequest[];

  IsDeleted: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface ServiceRequest {
  RequestId: string;
  UserId: string;
  ServiceId: string;
  PreferredDate?: Date;
  LocationDescription?: string;
  Status: ServiceRequestStatus;

  User?: User;
  Service?: Service;

  IsDeleted: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface Category {
  CategoryId: string;
  Name: string;
  ImageUrl?: string;

  Products?: Product[];

  IsDeleted: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface User {
  UserId: string;
  FirstName: string;
  SecondName: string;
  Email: string;
  Phone: string;
  County: string;
  LocationDescription?: string;
  Role: UserRole;
  PasswordHash: string;
  IsActive: boolean;
  IsWelcomed: boolean;

  Cart?: Cart;
  Orders?: Order[];
  Payments?: Payment[];
  Reviews?: Review[];
  ServiceRequests?: ServiceRequest[];
  RefreshTokens?: RefreshToken[];
  Recoveries?: Recovery[];
  StkRequests?: StkRequest[];

  IsDeleted: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface Cart {
  CartId: string;
  UserId: string;

  User?: User;
  Items?: CartItem[];

  IsDeleted: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface CartItem {
  CartItemId: string;
  CartId: string;
  ProductId: string;
  Quantity: number;

  Cart?: Cart;
  Product?: Product;

  IsDeleted: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface Order {
  OrderId: string;
  UserId: string;
  Status: OrderStatus;
  TotalAmount: number;

  User?: User;
  Items?: OrderItem[];
  Payments?: Payment[];

  IsDeleted: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface OrderItem {
  OrderItemId: string;
  OrderId: string;
  ProductId: string;
  Quantity: number;
  PriceAtPurchase: number;

  Order?: Order;
  Product?: Product;

  IsDeleted: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface Payment {
  PaymentId: string;
  UserId: string;
  OrderId: string;
  Amount: number;
  MpesaReferenceCode?: string;
  Status: PaymentStatus;

  User?: User;
  Order?: Order;
  StkRequests?: StkRequest[];

  IsDeleted: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface StkRequest {
  RequestId: string;
  PaymentId: string;
  UserId: string;
  MerchantRequestID: string;
  CheckoutRequestID: string;
  Amount: number;
  ResponseCode?: string;
  ResultCode?: string;
  ResultDesc?: string;

  Payment?: Payment;
  User?: User;

  IsDeleted: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface Review {
  ReviewId: string;
  UserId: string;
  ProductId: string;
  Rating: number;
  Message?: string;
  Status: ReviewStatus;

  User?: User;
  Product?: Product;

  IsDeleted: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface Advert {
  AdvertId: string;
  MediaUrl: string;
  MediaType: MediaType;
  Title?: string;
  IsActive: boolean;

  IsDeleted: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface Recovery {
  RecoveryId: string;
  UserId: string;
  RecoveryCode: string;
  Expiry: Date;
  IsUsed: boolean;
  Attempts: number;

  User?: User;

  IsDeleted: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface RefreshToken {
  RefreshTokenId: string;
  UserId: string;
  TokenHash: string;

  User?: User;

  IsDeleted: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface Job {
  JobId: string;
  Title: string;
  Description: string;
  Location?: string;
  SalaryRange?: string;
  EmploymentType: string;
  IsActive: boolean;

  Applications?: JobApplication[];

  IsDeleted: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface JobApplication {
  ApplicationId: string;
  JobId: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  ResumeUrl?: string;
  CoverLetter?: string;
  Status: JobApplicationStatus;

  Job?: Job;

  IsDeleted: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface TokenDetails {
  UserId: string;
  Email: string;
  Role: UserRole;
  iat?: any;
  exp?: any;
}

export interface MailConfiguration {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface MessageOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export interface ContactFormData {
  Name: string;
  Email: string;
  Phone: string;
  Subject: string;
  Message: string;
}

export interface StkPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export interface StkPayloadData {
  BusinessShortCode: string;
  Password: string;
  Timestamp: string;
  TransactionType: string;
  Amount: number;
  PartyA: string;
  PartyB: string;
  PhoneNumber: string;
  CallBackURL: string;
  AccountReference: string;
  TransactionDesc: string;
}

export interface StkPushData {
  PhoneNumber: string;
  Amount: number;
}

export interface CallbackUrlData {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata: {
        Item: {
          Name: string;
          Value: any;
        }[];
      };
    };
  };
}

export interface MessageOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export interface ContactFormData {
  Name: string;
  Email: string;
  Phone: string;
  Subject: string;
  Message: string;
}

export interface HeroSlide {
  SlideId: string;
  ImageUrl: string;
  Tag: string;
  Title: string;
  TitleAccent: string;
  Description: string;
  CtaLabel: string;
  CtaLink: string;
  SortOrder: number;
  IsActive: boolean;
  IsDeleted: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}