/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropTable
DROP TABLE [dbo].[Product];

-- CreateTable
CREATE TABLE [dbo].[Organisation] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Organisation_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [customerId] NVARCHAR(1000),
    CONSTRAINT [Organisation_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Organisation_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[UserOrganisations] (
    [userId] NVARCHAR(1000) NOT NULL,
    [organisationId] NVARCHAR(1000) NOT NULL,
    [role] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [UserOrganisations_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [defaultAt] DATETIME2 NOT NULL CONSTRAINT [UserOrganisations_defaultAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [UserOrganisations_pkey] PRIMARY KEY CLUSTERED ([userId],[organisationId])
);

-- AddForeignKey
ALTER TABLE [dbo].[UserOrganisations] ADD CONSTRAINT [UserOrganisations_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UserOrganisations] ADD CONSTRAINT [UserOrganisations_organisationId_fkey] FOREIGN KEY ([organisationId]) REFERENCES [dbo].[Organisation]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
