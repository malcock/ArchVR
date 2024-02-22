BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[File] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [filepath] NVARCHAR(1000) NOT NULL,
    [thumbnail] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [File_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [File_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [File_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[OrganisationFiles] (
    [organisationId] NVARCHAR(1000) NOT NULL,
    [fileId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [OrganisationFiles_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [OrganisationFiles_pkey] PRIMARY KEY CLUSTERED ([organisationId],[fileId])
);

-- CreateTable
CREATE TABLE [dbo].[SceneFiles] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL CONSTRAINT [SceneFiles_name_df] DEFAULT 'Unnamed Node',
    [sceneId] NVARCHAR(1000) NOT NULL,
    [parentId] NVARCHAR(1000),
    [transform] NVARCHAR(1000),
    [fileId] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [SceneFiles_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [SceneFiles_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [SceneFiles_id_key] UNIQUE NONCLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[OrganisationFiles] ADD CONSTRAINT [OrganisationFiles_fileId_fkey] FOREIGN KEY ([fileId]) REFERENCES [dbo].[File]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OrganisationFiles] ADD CONSTRAINT [OrganisationFiles_organisationId_fkey] FOREIGN KEY ([organisationId]) REFERENCES [dbo].[Organisation]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SceneFiles] ADD CONSTRAINT [SceneFiles_fileId_fkey] FOREIGN KEY ([fileId]) REFERENCES [dbo].[File]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SceneFiles] ADD CONSTRAINT [SceneFiles_sceneId_fkey] FOREIGN KEY ([sceneId]) REFERENCES [dbo].[Scene]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
