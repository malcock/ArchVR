/*
  Warnings:

  - You are about to drop the column `organisationId` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `Device` table. All the data in the column will be lost.
  - Added the required column `projectId` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Device] DROP CONSTRAINT [Device_organisationId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Device] DROP CONSTRAINT [Device_parentId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Device] DROP COLUMN [organisationId],
[parentId];
ALTER TABLE [dbo].[Device] ADD [projectId] NVARCHAR(1000) NOT NULL,
[topic] NVARCHAR(1000),
[unit] NVARCHAR(1000),
[unitType] NVARCHAR(1000);

-- AddForeignKey
ALTER TABLE [dbo].[Device] ADD CONSTRAINT [Device_projectId_fkey] FOREIGN KEY ([projectId]) REFERENCES [dbo].[Project]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
