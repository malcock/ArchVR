BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Device] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000),
    [deviceType] NVARCHAR(1000),
    [username] NVARCHAR(1000),
    [password] NVARCHAR(1000),
    [transform] NVARCHAR(1000),
    [sceneId] NVARCHAR(1000),
    [parentId] NVARCHAR(1000),
    [organisationId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Device_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Device_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Device_id_key] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [Device_username_key] UNIQUE NONCLUSTERED ([username])
);

-- AddForeignKey
ALTER TABLE [dbo].[Device] ADD CONSTRAINT [Device_sceneId_fkey] FOREIGN KEY ([sceneId]) REFERENCES [dbo].[Scene]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Device] ADD CONSTRAINT [Device_parentId_fkey] FOREIGN KEY ([parentId]) REFERENCES [dbo].[Device]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Device] ADD CONSTRAINT [Device_organisationId_fkey] FOREIGN KEY ([organisationId]) REFERENCES [dbo].[Organisation]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
