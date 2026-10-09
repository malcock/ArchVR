import { Permissions } from "~/enums/Permissions";
import {
  hasProjectPermission,
  hasScenePermission,
  protectedProcedure,
  router,
} from "../trpc";
import { string, z } from "zod";
import sceneService from "~/services/scene.service";
import { searchOptionsSchema } from "~/schemas/apiOptions";

const widgetPositionSchema = z.object({
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
});

export const sceneRouter = router({
  get: protectedProcedure
    .input(z.object({ sceneId: z.string() }))
    .use(hasScenePermission(Permissions.ViewProject))
    .query(({ input: { sceneId } }) => {
      return sceneService.get(sceneId);
    }),
  create: protectedProcedure
    .input(z.object({ projectId: z.string(), name: z.string() }))
    .use(hasProjectPermission(Permissions.EditProject))
    .mutation(({ input: { name, projectId } }) => {
      return sceneService.create(name, projectId);
    }),
  update: protectedProcedure
    .input(z.object({ sceneId: z.string(), name: z.string() }))
    .use(hasScenePermission(Permissions.EditProject))
    .mutation(({ input: { name, sceneId } }) => {
      return sceneService.update(sceneId, { name });
    }),
  addFile: protectedProcedure
    .input(
      z.object({
        sceneId: z.string(),
        fileId: z.string(),
        name: z.string().optional(),
        transform: z.string().optional(),
        parentId: z.string().optional(),
      })
    )
    .use(hasScenePermission(Permissions.EditProject))
    .mutation(({ input: { fileId, sceneId, name, parentId, transform } }) => {
      return sceneService.addFile(sceneId, fileId, name, parentId, transform);
    }),
  addDevice: protectedProcedure
    .input(
      z.object({
        sceneId: z.string(),
        transform: z.string(),
      })
    )
    .use(hasScenePermission(Permissions.EditProject))
    .mutation(({ input: { sceneId, transform } }) => {
      return sceneService.addDevice(sceneId, transform);
    }),
  addWidget: protectedProcedure
    .input(
      z.object({
        sceneId: z.string(),
        widgetTypeId: z.string().optional(),
        name: z.string().optional(),
        position: widgetPositionSchema.optional(),
      })
    )
    .query(({ input: { sceneId, widgetTypeId, name, position } }) => {
      return sceneService.addWidget(
        sceneId,
        widgetTypeId,
        name,
        position && JSON.stringify(position)
      );
    }),
  moveWidget: protectedProcedure
    .input(z.object({ widgetId: z.string(), position: widgetPositionSchema }))
    .mutation(async ({ input: { widgetId, position } }) => {
      await sceneService.setWidget(widgetId, {
        position: JSON.stringify(position),
      });
    }),
  list: protectedProcedure
    .input(
      searchOptionsSchema.merge(
        z.object({
          projectId: z.string(),
          orderBy: z.enum(["name", "updatedAt", "createdAt"]).optional(),
        })
      )
    )
    .use(hasProjectPermission(Permissions.EditProject))
    .query(({ input }) => {
      console.log("hello?");
      return sceneService.list(input);
    }),
});

type PropertyType<T, K extends keyof T> = T[K];
type ArrayType<T> = T extends (infer U)[] ? U : never;
export type SceneType = Awaited<ReturnType<typeof sceneService.get>>;
export type SceneWidgetType = ArrayType<PropertyType<SceneType, "widgets">>;
