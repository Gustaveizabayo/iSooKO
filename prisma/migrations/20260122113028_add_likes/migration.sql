/*
  Warnings:

  - You are about to drop the column `isPublished` on the `courses` table. All the data in the column will be lost.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[googleId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'INSTRUCTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ProfileStatus" AS ENUM ('PENDING', 'ACTIVE', 'REJECTED', 'SUSPENDED');

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "isPublished",
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "status" "CourseStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "thumbnailUrl" TEXT,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "enrollments" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "createdBy" TEXT;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "createdBy" TEXT;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "isFlagged" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "refreshToken" TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'STUDENT';

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "attachments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT,
    "userId" TEXT NOT NULL,
    "courseId" TEXT,
    "lessonId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "profileImageUrl" TEXT,
    "timezone" TEXT,
    "language" TEXT,
    "experience" TEXT,
    "qualifications" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "status" "ProfileStatus" NOT NULL DEFAULT 'PENDING',
    "adminFeedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_profile_logs" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_profile_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "likes_courseId_userId_key" ON "likes"("courseId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_profile_logs" ADD CONSTRAINT "admin_profile_logs_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_profile_logs" ADD CONSTRAINT "admin_profile_logs_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
