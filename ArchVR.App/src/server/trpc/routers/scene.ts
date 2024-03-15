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

export type SceneType = Awaited<ReturnType<typeof sceneService.get>>;
