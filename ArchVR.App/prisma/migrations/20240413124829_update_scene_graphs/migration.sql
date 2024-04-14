/*
  Warnings:

  - You are about to drop the column `sceneWidgetId` on the `SceneGraph` table. All the data in the column will be lost.
  - You are about to drop the column `deviceId` on the `SceneWidgets` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[graphId]` on the table `SceneWidgets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `graphId` to the `SceneWidgets` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[SceneGraph] DROP CONSTRAINT [SceneGraph_sceneWidgetId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[SceneWidgets] DROP CONSTRAINT [SceneWidgets_deviceId_fkey];

-- DropIndex
ALTER TABLE [dbo].[SceneGraph] DROP CONSTRAINT [SceneGraph_sceneWidgetId_key];

-- AlterTable
ALTER TABLE [dbo].[SceneGraph] DROP COLUMN [sceneWidgetId];

-- AlterTable
ALTER TABLE [dbo].[SceneWidgets] DROP CONSTRAINT [SceneWidgets_position_df];
ALTER TABLE [dbo].[SceneWidgets] DROP COLUMN [deviceId];
ALTER TABLE [dbo].[SceneWidgets] ADD CONSTRAINT [SceneWidgets_position_df] DEFAULT '{"x":92,"y":92,"w":128,"h":128}' FOR [position];
ALTER TABLE [dbo].[SceneWidgets] ADD [graphId] NVARCHAR(1000) NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[SceneWidgets] ADD CONSTRAINT [SceneWidgets_graphId_key] UNIQUE NONCLUSTERED ([graphId]);

-- AddForeignKey
ALTER TABLE [dbo].[SceneWidgets] ADD CONSTRAINT [SceneWidgets_graphId_fkey] FOREIGN KEY ([graphId]) REFERENCES [dbo].[SceneGraph]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
