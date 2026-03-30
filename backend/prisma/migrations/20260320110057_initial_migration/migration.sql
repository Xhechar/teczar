-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('AwaitingPayment', 'Paid', 'Processing', 'Delivered', 'Cancelled');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Pending', 'Completed', 'Failed');

-- CreateEnum
CREATE TYPE "ServiceRequestStatus" AS ENUM ('Pending', 'Contacted', 'Scheduled', 'Completed', 'Cancelled');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('Image', 'Video');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Admin', 'Customer', 'Staff');

-- CreateEnum
CREATE TYPE "JobApplicationStatus" AS ENUM ('Pending', 'Reviewing', 'Interview', 'Accepted', 'Rejected');

-- CreateTable
CREATE TABLE "Product" (
    "ProductId" UUID NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Price" DECIMAL(10,2) NOT NULL,
    "OfferPrice" DECIMAL(10,2),
    "OnOffer" BOOLEAN NOT NULL DEFAULT false,
    "Quantity" INTEGER NOT NULL,
    "CategoryId" UUID NOT NULL,
    "IsFeatured" BOOLEAN NOT NULL DEFAULT false,
    "IsAvailable" BOOLEAN NOT NULL DEFAULT true,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("ProductId")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "ImageId" UUID NOT NULL,
    "ProductId" UUID NOT NULL,
    "ImageUrl" TEXT NOT NULL,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("ImageId")
);

-- CreateTable
CREATE TABLE "Service" (
    "ServiceId" UUID NOT NULL,
    "Title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "ImageUrl" TEXT NOT NULL,
    "OnOffer" BOOLEAN NOT NULL DEFAULT false,
    "IsFeatured" BOOLEAN NOT NULL DEFAULT false,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("ServiceId")
);

-- CreateTable
CREATE TABLE "ServiceRequest" (
    "RequestId" UUID NOT NULL,
    "UserId" UUID NOT NULL,
    "ServiceId" UUID NOT NULL,
    "PreferredDate" TIMESTAMP(3) NOT NULL,
    "LocationDescription" TEXT NOT NULL,
    "Status" "ServiceRequestStatus" NOT NULL DEFAULT 'Pending',
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("RequestId")
);

-- CreateTable
CREATE TABLE "Category" (
    "CategoryId" UUID NOT NULL,
    "Name" TEXT NOT NULL,
    "ImageUrl" TEXT,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("CategoryId")
);

-- CreateTable
CREATE TABLE "User" (
    "UserId" UUID NOT NULL,
    "FirstName" TEXT NOT NULL,
    "SecondName" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Phone" TEXT NOT NULL,
    "County" TEXT NOT NULL,
    "LocationDescription" TEXT NOT NULL,
    "Role" "UserRole" NOT NULL DEFAULT 'Customer',
    "PasswordHash" TEXT NOT NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "IsWelcomed" BOOLEAN NOT NULL DEFAULT false,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("UserId")
);

-- CreateTable
CREATE TABLE "Cart" (
    "CartId" UUID NOT NULL,
    "UserId" UUID NOT NULL,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("CartId")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "CartItemId" UUID NOT NULL,
    "CartId" UUID NOT NULL,
    "ProductId" UUID NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("CartItemId")
);

-- CreateTable
CREATE TABLE "Order" (
    "OrderId" UUID NOT NULL,
    "UserId" UUID NOT NULL,
    "Status" "OrderStatus" NOT NULL DEFAULT 'AwaitingPayment',
    "TotalAmount" DECIMAL(10,2) NOT NULL,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("OrderId")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "OrderItemId" UUID NOT NULL,
    "OrderId" UUID NOT NULL,
    "ProductId" UUID NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "PriceAtPurchase" DECIMAL(10,2) NOT NULL,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("OrderItemId")
);

-- CreateTable
CREATE TABLE "Payment" (
    "PaymentId" UUID NOT NULL,
    "UserId" UUID NOT NULL,
    "OrderId" UUID NOT NULL,
    "Amount" DECIMAL(10,2) NOT NULL,
    "MpesaReferenceCode" TEXT,
    "Status" "PaymentStatus" NOT NULL DEFAULT 'Pending',
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("PaymentId")
);

-- CreateTable
CREATE TABLE "Review" (
    "ReviewId" UUID NOT NULL,
    "UserId" UUID NOT NULL,
    "ProductId" UUID NOT NULL,
    "Rating" INTEGER NOT NULL,
    "Message" TEXT NOT NULL,
    "Status" "ReviewStatus" NOT NULL DEFAULT 'Pending',
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("ReviewId")
);

-- CreateTable
CREATE TABLE "StkRequest" (
    "RequestId" UUID NOT NULL,
    "PaymentId" UUID NOT NULL,
    "UserId" UUID NOT NULL,
    "MerchantRequestID" TEXT NOT NULL,
    "CheckoutRequestID" TEXT NOT NULL,
    "Amount" DECIMAL(10,2) NOT NULL,
    "ResponseCode" TEXT,
    "ResultCode" TEXT,
    "ResultDesc" TEXT,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StkRequest_pkey" PRIMARY KEY ("RequestId")
);

-- CreateTable
CREATE TABLE "Advert" (
    "AdvertId" UUID NOT NULL,
    "MediaUrl" TEXT NOT NULL,
    "MediaType" "MediaType" NOT NULL,
    "Title" TEXT NOT NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Advert_pkey" PRIMARY KEY ("AdvertId")
);

-- CreateTable
CREATE TABLE "Recovery" (
    "RecoveryId" UUID NOT NULL,
    "Email" UUID NOT NULL,
    "RecoveryCode" TEXT NOT NULL,
    "Expiry" TIMESTAMP(3) NOT NULL,
    "IsUsed" BOOLEAN NOT NULL DEFAULT false,
    "Attempts" INTEGER NOT NULL DEFAULT 0,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recovery_pkey" PRIMARY KEY ("RecoveryId")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "RefreshTokenId" UUID NOT NULL,
    "UserId" UUID NOT NULL,
    "TokenHash" TEXT NOT NULL,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("RefreshTokenId")
);

-- CreateTable
CREATE TABLE "Job" (
    "JobId" UUID NOT NULL,
    "Title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Location" TEXT NOT NULL,
    "SalaryRange" TEXT,
    "EmploymentType" TEXT NOT NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("JobId")
);

-- CreateTable
CREATE TABLE "JobApplication" (
    "ApplicationId" UUID NOT NULL,
    "JobId" UUID NOT NULL,
    "FullName" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Phone" TEXT NOT NULL,
    "ResumeUrl" TEXT,
    "CoverLetter" TEXT,
    "Status" "JobApplicationStatus" NOT NULL DEFAULT 'Pending',
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("ApplicationId")
);

-- CreateIndex
CREATE INDEX "Product_CategoryId_idx" ON "Product"("CategoryId");

-- CreateIndex
CREATE INDEX "Product_IsFeatured_idx" ON "Product"("IsFeatured");

-- CreateIndex
CREATE INDEX "ProductImage_ProductId_idx" ON "ProductImage"("ProductId");

-- CreateIndex
CREATE INDEX "Service_IsFeatured_idx" ON "Service"("IsFeatured");

-- CreateIndex
CREATE INDEX "ServiceRequest_UserId_idx" ON "ServiceRequest"("UserId");

-- CreateIndex
CREATE INDEX "ServiceRequest_ServiceId_idx" ON "ServiceRequest"("ServiceId");

-- CreateIndex
CREATE INDEX "ServiceRequest_Status_idx" ON "ServiceRequest"("Status");

-- CreateIndex
CREATE INDEX "Category_Name_idx" ON "Category"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "User_Phone_key" ON "User"("Phone");

-- CreateIndex
CREATE INDEX "User_Role_idx" ON "User"("Role");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_UserId_key" ON "Cart"("UserId");

-- CreateIndex
CREATE INDEX "CartItem_CartId_idx" ON "CartItem"("CartId");

-- CreateIndex
CREATE INDEX "CartItem_ProductId_idx" ON "CartItem"("ProductId");

-- CreateIndex
CREATE INDEX "Order_UserId_idx" ON "Order"("UserId");

-- CreateIndex
CREATE INDEX "Order_Status_idx" ON "Order"("Status");

-- CreateIndex
CREATE INDEX "OrderItem_OrderId_idx" ON "OrderItem"("OrderId");

-- CreateIndex
CREATE INDEX "OrderItem_ProductId_idx" ON "OrderItem"("ProductId");

-- CreateIndex
CREATE INDEX "Payment_UserId_idx" ON "Payment"("UserId");

-- CreateIndex
CREATE INDEX "Payment_OrderId_idx" ON "Payment"("OrderId");

-- CreateIndex
CREATE INDEX "Payment_Status_idx" ON "Payment"("Status");

-- CreateIndex
CREATE UNIQUE INDEX "StkRequest_MerchantRequestID_key" ON "StkRequest"("MerchantRequestID");

-- CreateIndex
CREATE UNIQUE INDEX "StkRequest_CheckoutRequestID_key" ON "StkRequest"("CheckoutRequestID");

-- CreateIndex
CREATE INDEX "StkRequest_PaymentId_idx" ON "StkRequest"("PaymentId");

-- CreateIndex
CREATE INDEX "Recovery_Email_idx" ON "Recovery"("Email");

-- CreateIndex
CREATE INDEX "RefreshToken_UserId_idx" ON "RefreshToken"("UserId");

-- CreateIndex
CREATE INDEX "JobApplication_JobId_idx" ON "JobApplication"("JobId");

-- CreateIndex
CREATE UNIQUE INDEX "JobApplication_JobId_Phone_key" ON "JobApplication"("JobId", "Phone");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_CategoryId_fkey" FOREIGN KEY ("CategoryId") REFERENCES "Category"("CategoryId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES "Product"("ProductId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("UserId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_ServiceId_fkey" FOREIGN KEY ("ServiceId") REFERENCES "Service"("ServiceId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("UserId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_CartId_fkey" FOREIGN KEY ("CartId") REFERENCES "Cart"("CartId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES "Product"("ProductId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("UserId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_OrderId_fkey" FOREIGN KEY ("OrderId") REFERENCES "Order"("OrderId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES "Product"("ProductId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("UserId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_OrderId_fkey" FOREIGN KEY ("OrderId") REFERENCES "Order"("OrderId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("UserId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES "Product"("ProductId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StkRequest" ADD CONSTRAINT "StkRequest_PaymentId_fkey" FOREIGN KEY ("PaymentId") REFERENCES "Payment"("PaymentId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StkRequest" ADD CONSTRAINT "StkRequest_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("UserId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("UserId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_JobId_fkey" FOREIGN KEY ("JobId") REFERENCES "Job"("JobId") ON DELETE NO ACTION ON UPDATE NO ACTION;
