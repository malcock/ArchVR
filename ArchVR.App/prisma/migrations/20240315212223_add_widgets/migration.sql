BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[WidgetType] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [component] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [WidgetType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [WidgetType_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SceneWidgets] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL CONSTRAINT [SceneWidgets_name_df] DEFAULT 'New Widget',
    [deviceId] NVARCHAR(1000),
    [sceneId] NVARCHAR(1000) NOT NULL,
    [widgetTypeId] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [SceneWidgets_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [SceneWidgets_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [SceneWidgets_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SceneGraph] (
    [id] NVARCHAR(1000) NOT NULL,
    [file] NVARCHAR(1000) NOT NULL,
    [sceneId] NVARCHAR(1000) NOT NULL,
    [sceneWidgetId] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [SceneGraph_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [SceneGraph_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [SceneGraph_id_key] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [SceneGraph_sceneWidgetId_key] UNIQUE NONCLUSTERED ([sceneWidgetId])
);

-- AddForeignKey
ALTER TABLE [dbo].[SceneWidgets] ADD CONSTRAINT [SceneWidgets_deviceId_fkey] FOREIGN KEY ([deviceId]) REFERENCES [dbo].[Device]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SceneWidgets] ADD CONSTRAINT [SceneWidgets_sceneId_fkey] FOREIGN KEY ([sceneId]) REFERENCES [dbo].[Scene]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SceneWidgets] ADD CONSTRAINT [SceneWidgets_widgetTypeId_fkey] FOREIGN KEY ([widgetTypeId]) REFERENCES [dbo].[WidgetType]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SceneGraph] ADD CONSTRAINT [SceneGraph_sceneId_fkey] FOREIGN KEY ([sceneId]) REFERENCES [dbo].[Scene]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SceneGraph] ADD CONSTRAINT [SceneGraph_sceneWidgetId_fkey] FOREIGN KEY ([sceneWidgetId]) REFERENCES [dbo].[SceneWidgets]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
