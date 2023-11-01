BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000),
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [isAdmin] BIT NOT NULL CONSTRAINT [User_isAdmin_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_id_key] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[RefreshToken] (
    [id] NVARCHAR(1000) NOT NULL,
    [hashedToken] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [organisationId] NVARCHAR(1000) NOT NULL,
    [revoked] BIT NOT NULL CONSTRAINT [RefreshToken_revoked_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [RefreshToken_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [RefreshToken_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [RefreshToken_id_key] UNIQUE NONCLUSTERED ([id])
);

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

-- CreateTable
CREATE TABLE [dbo].[OrganisationFiles] (
    [organisationId] NVARCHAR(1000) NOT NULL,
    [fileId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [OrganisationFiles_pkey] PRIMARY KEY CLUSTERED ([organisationId],[fileId])
);

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

-- CreateTable
CREATE TABLE [dbo].[Scene] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL CONSTRAINT [Scene_name_df] DEFAULT 'Unnamed Scene',
    [projectId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Scene_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Scene_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Scene_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Node] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL CONSTRAINT [Node_name_df] DEFAULT 'Unnamed Node',
    [sceneId] NVARCHAR(1000) NOT NULL,
    [parentId] NVARCHAR(1000),
    [transform] NVARCHAR(1000),
    [fileId] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Node_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Node_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Node_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[File] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [originalFilepath] NVARCHAR(1000),
    [processedFilepath] NVARCHAR(1000),
    [thumbFilepath] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [File_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [File_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [File_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Device] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000),
    [username] NVARCHAR(1000),
    [password] NVARCHAR(1000),
    [deviceType] NVARCHAR(1000),
    [transform] NVARCHAR(1000),
    [parentId] NVARCHAR(1000),
    [organisationId] NVARCHAR(1000) NOT NULL,
    [sceneId] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Device_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Device_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Device_id_key] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [Device_username_key] UNIQUE NONCLUSTERED ([username])
);

-- AddForeignKey
ALTER TABLE [dbo].[RefreshToken] ADD CONSTRAINT [RefreshToken_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UserOrganisations] ADD CONSTRAINT [UserOrganisations_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UserOrganisations] ADD CONSTRAINT [UserOrganisations_organisationId_fkey] FOREIGN KEY ([organisationId]) REFERENCES [dbo].[Organisation]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OrganisationFiles] ADD CONSTRAINT [OrganisationFiles_fileId_fkey] FOREIGN KEY ([fileId]) REFERENCES [dbo].[File]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OrganisationFiles] ADD CONSTRAINT [OrganisationFiles_organisationId_fkey] FOREIGN KEY ([organisationId]) REFERENCES [dbo].[Organisation]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Project] ADD CONSTRAINT [Project_organisationId_fkey] FOREIGN KEY ([organisationId]) REFERENCES [dbo].[Organisation]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProjectRoles] ADD CONSTRAINT [ProjectRoles_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProjectRoles] ADD CONSTRAINT [ProjectRoles_projectId_fkey] FOREIGN KEY ([projectId]) REFERENCES [dbo].[Project]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Scene] ADD CONSTRAINT [Scene_projectId_fkey] FOREIGN KEY ([projectId]) REFERENCES [dbo].[Project]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Node] ADD CONSTRAINT [Node_parentId_fkey] FOREIGN KEY ([parentId]) REFERENCES [dbo].[Node]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Node] ADD CONSTRAINT [Node_fileId_fkey] FOREIGN KEY ([fileId]) REFERENCES [dbo].[File]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Node] ADD CONSTRAINT [Node_sceneId_fkey] FOREIGN KEY ([sceneId]) REFERENCES [dbo].[Scene]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Device] ADD CONSTRAINT [Device_parentId_fkey] FOREIGN KEY ([parentId]) REFERENCES [dbo].[Device]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Device] ADD CONSTRAINT [Device_organisationId_fkey] FOREIGN KEY ([organisationId]) REFERENCES [dbo].[Organisation]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Device] ADD CONSTRAINT [Device_sceneId_fkey] FOREIGN KEY ([sceneId]) REFERENCES [dbo].[Scene]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
