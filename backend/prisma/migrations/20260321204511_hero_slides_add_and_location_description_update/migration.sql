-- AlterTable
ALTER TABLE "User" ALTER COLUMN "LocationDescription" DROP NOT NULL;

-- CreateTable
CREATE TABLE "HeroSlide" (
    "SlideId" UUID NOT NULL,
    "ImageUrl" TEXT NOT NULL,
    "Tag" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "TitleAccent" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "CtaLabel" TEXT NOT NULL,
    "CtaLink" TEXT NOT NULL,
    "SortOrder" INTEGER NOT NULL DEFAULT 0,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSlide_pkey" PRIMARY KEY ("SlideId")
);

-- CreateIndex
CREATE INDEX "HeroSlide_SortOrder_idx" ON "HeroSlide"("SortOrder");

-- CreateIndex
CREATE INDEX "HeroSlide_IsActive_SortOrder_idx" ON "HeroSlide"("IsActive", "SortOrder");
