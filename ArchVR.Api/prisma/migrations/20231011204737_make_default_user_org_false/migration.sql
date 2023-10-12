BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[UserOrganisations] DROP CONSTRAINT [UserOrganisations_isDefault_df];
ALTER TABLE [dbo].[UserOrganisations] ADD CONSTRAINT [UserOrganisations_isDefault_df] DEFAULT 0 FOR [isDefault];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
