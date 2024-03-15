/*
  Warnings:

  - You are about to drop the column `password` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Device` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Device] DROP CONSTRAINT [Device_projectId_fkey];

-- DropIndex
ALTER TABLE [dbo].[Device] DROP CONSTRAINT [Device_username_key];

-- AlterTable
ALTER TABLE [dbo].[Device] DROP COLUMN [password],
[projectId],
[username];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
