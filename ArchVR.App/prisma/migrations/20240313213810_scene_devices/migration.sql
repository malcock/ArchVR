/*
  Warnings:

  - You are about to drop the column `sceneId` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `transform` on the `Device` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Device] DROP CONSTRAINT [Device_sceneId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Device] DROP COLUMN [sceneId],
[transform];

-- CreateTable
CREATE TABLE [dbo].[SceneDevices] (
    [id] NVARCHAR(1000) NOT NULL,
    [sceneId] NVARCHAR(1000) NOT NULL,
    [deviceId] NVARCHAR(1000) NOT NULL,
    [transform] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [SceneDevices_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [SceneDevices_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [SceneDevices_id_key] UNIQUE NONCLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[SceneDevices] ADD CONSTRAINT [SceneDevices_deviceId_fkey] FOREIGN KEY ([deviceId]) REFERENCES [dbo].[Device]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SceneDevices] ADD CONSTRAINT [SceneDevices_sceneId_fkey] FOREIGN KEY ([sceneId]) REFERENCES [dbo].[Scene]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
