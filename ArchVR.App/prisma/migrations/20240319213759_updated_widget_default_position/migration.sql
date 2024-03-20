BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[SceneWidgets] DROP CONSTRAINT [SceneWidgets_position_df];
ALTER TABLE [dbo].[SceneWidgets] ADD CONSTRAINT [SceneWidgets_position_df] DEFAULT '{''x'':92,''y'':92,''w'':128,''h'':128}' FOR [position];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
