/*
  Warnings:

  - You are about to drop the `SceneDevice` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[SceneDevice] DROP CONSTRAINT [SceneDevice_sceneId_fkey];

-- DropTable
DROP TABLE [dbo].[SceneDevice];

-- CreateTable
CREATE TABLE [dbo].[Device] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000),
    [unit] NVARCHAR(1000),
    [unitType] NVARCHAR(1000),
    [deviceType] NVARCHAR(1000),
    [topic] NVARCHAR(1000),
    [transform] NVARCHAR(1000),
    [sceneId] NVARCHAR(1000),
    [projectId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Device_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Device_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Device_id_key] UNIQUE NONCLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Device] ADD CONSTRAINT [Device_sceneId_fkey] FOREIGN KEY ([sceneId]) REFERENCES [dbo].[Scene]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

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
