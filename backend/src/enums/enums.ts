export enum OrderStatus {
  AwaitingPayment = "AwaitingPayment",
  Paid = "Paid",
  Processing = "Processing",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
}

export enum PaymentStatus {
  Pending = "Pending",
  Completed = "Completed",
  Failed = "Failed",
}

export enum ServiceRequestStatus {
  Pending = "Pending",
  Contacted = "Contacted",
  Scheduled = "Scheduled",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

export enum ReviewStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

export enum MediaType {
  Image = "Image",
  Video = "Video",
}

export enum UserRole {
  Admin = "Admin",
  Customer = "Customer",
  Staff = "Staff",
}

export enum JobApplicationStatus {
  Pending = "Pending",
  Reviewing = "Reviewing",
  Interview = "Interview",
  Accepted = "Accepted",
  Rejected = "Rejected",
}

export enum ErrorType {
  SERVER = "SERVER ERROR",
  CLIENT = "INVALID INPUT",
  NOTFOUND = "NOT FOUND",
  UNAUTHORIZED = "UNAUTHORIZED ACCESS",
  EMPTY = "NO RECORDS",
  DUPLICATE = "DUPLICATE ERROR",
  VALIDATION = "VALIDATION ERROR",
  BADREQUEST = "BAD REQUEST",
  FORBIDDEN = "FORBIDDEN",
}

export enum ModelType {
  User = "User",
  Advert = "Advert",
  JobApplication = "JobApplication",
  Job = "Job",
  Review = "Review",
  Payment = "Payment",
  OrderItem = "OrderItem",
  Order = "Order",
  CartItem = "CartItem",
  Cart = "Cart",
  Category = "Category",
  ServiceRequest = "ServiceRequest",
  Service = "Service",
  ProductImage = "ProductImage",
  Product = "Product",
  HeroSlide = "HeroSlide"
}

export enum SocketTypes {
  // User
  usc = "user-created",
  usu = "user-updated",
  usd = "user-deleted",

  // HeroSlide
  hsc = "hero-slide-created",
  hsu = "hero-slide-updated",
  hsd = "hero-slide-deleted",

  // Advert
  adc = "advert-created",
  adu = "advert-updated",
  add = "advert-deleted",

  // Job Application
  jac = "job-application-created",
  jau = "job-application-updated",
  jad = "job-application-deleted",

  // Job
  joc = "job-created",
  jou = "job-updated",
  jod = "job-deleted",

  // Review
  rec = "review-created",
  reu = "review-updated",
  red = "review-deleted",

  // Payment
  pac = "payment-created",
  pau = "payment-updated",
  pad = "payment-deleted",

  // Order Item
  oic = "order-item-created",
  oiu = "order-item-updated",
  oid = "order-item-deleted",

  // Order
  orc = "order-created",
  oru = "order-updated",
  ord = "order-deleted",

  // Cart Item
  cic = "cart-item-created",
  ciu = "cart-item-updated",
  cid = "cart-item-deleted",

  // Cart
  cac = "cart-created",
  cau = "cart-updated",
  cad = "cart-deleted",

  // Category
  cgc = "category-created",
  cgu = "category-updated",
  cgd = "category-deleted",

  // Service Request
  src = "service-request-created",
  sru = "service-request-updated",
  srd = "service-request-deleted",

  // Service
  sec = "service-created",
  seu = "service-updated",
  sed = "service-deleted",

  // Product Image
  pic = "product-image-created",
  piu = "product-image-updated",
  pid = "product-image-deleted",

  // Product
  prc = "product-created",
  pru = "product-updated",
  prd = "product-deleted",
}
