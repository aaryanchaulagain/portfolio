-- AlterTable
ALTER TABLE "Service" ADD COLUMN "imageUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Service" ADD COLUMN "coverImageId" TEXT;

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roleOrCompany" TEXT NOT NULL DEFAULT '',
    "quote" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "photoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "ContentImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "ContentImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
