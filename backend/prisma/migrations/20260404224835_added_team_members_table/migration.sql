-- CreateTable
CREATE TABLE "TeamMember" (
    "MemberId" UUID NOT NULL,
    "Name" TEXT NOT NULL,
    "Role" TEXT NOT NULL,
    "ImageUrl" TEXT NOT NULL,
    "Bio" TEXT,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("MemberId")
);

-- CreateIndex
CREATE INDEX "TeamMember_IsActive_idx" ON "TeamMember"("IsActive");
