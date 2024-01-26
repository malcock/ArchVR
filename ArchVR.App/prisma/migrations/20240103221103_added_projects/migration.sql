BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Project] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL CONSTRAINT [Project_name_df] DEFAULT 'Unnamed Project',
    [organisationId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Project_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Project_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Project_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ProjectRoles] (
    [userId] NVARCHAR(1000) NOT NULL,
    [projectId] NVARCHAR(1000) NOT NULL,
    [role] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [ProjectRoles_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [ProjectRoles_pkey] PRIMARY KEY CLUSTERED ([userId],[projectId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Project] ADD CONSTRAINT [Project_organisationId_fkey] FOREIGN KEY ([organisationId]) REFERENCES [dbo].[Organisation]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProjectRoles] ADD CONSTRAINT [ProjectRoles_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProjectRoles] ADD CONSTRAINT [ProjectRoles_projectId_fkey] FOREIGN KEY ([projectId]) REFERENCES [dbo].[Project]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
