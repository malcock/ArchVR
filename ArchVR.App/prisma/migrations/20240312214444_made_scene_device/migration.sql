/*
  Warnings:

  - You are about to drop the `Device` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Device] DROP CONSTRAINT [Device_sceneId_fkey];

-- DropTable
DROP TABLE [dbo].[Device];

-- CreateTable
CREATE TABLE [dbo].[SceneDevice] (
    [id] NVARCHAR(1000) NOT NULL,
    [topic] NVARCHAR(1000),
    [name] NVARCHAR(1000),
    [unit] NVARCHAR(1000),
    [unitType] NVARCHAR(1000),
    [deviceType] NVARCHAR(1000),
    [transform] NVARCHAR(1000),
    [sceneId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [SceneDevice_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [SceneDevice_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [SceneDevice_id_key] UNIQUE NONCLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[SceneDevice] ADD CONSTRAINT [SceneDevice_sceneId_fkey] FOREIGN KEY ([sceneId]) REFERENCES [dbo].[Scene]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
