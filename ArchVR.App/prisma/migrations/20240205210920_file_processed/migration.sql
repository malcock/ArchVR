/*
  Warnings:

  - You are about to drop the column `filepath` on the `File` table. All the data in the column will be lost.
  - Added the required column `original` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `File` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[File] ALTER COLUMN [thumbnail] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[File] DROP COLUMN [filepath];
ALTER TABLE [dbo].[File] ADD [original] NVARCHAR(1000) NOT NULL,
[processed] NVARCHAR(1000),
[type] NVARCHAR(1000) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
