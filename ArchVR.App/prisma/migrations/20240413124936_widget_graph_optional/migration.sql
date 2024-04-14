BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[SceneWidgets] DROP CONSTRAINT [SceneWidgets_graphId_fkey];

-- AlterTable
ALTER TABLE [dbo].[SceneWidgets] ALTER COLUMN [graphId] NVARCHAR(1000) NULL;

-- AddForeignKey
ALTER TABLE [dbo].[SceneWidgets] ADD CONSTRAINT [SceneWidgets_graphId_fkey] FOREIGN KEY ([graphId]) REFERENCES [dbo].[SceneGraph]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
