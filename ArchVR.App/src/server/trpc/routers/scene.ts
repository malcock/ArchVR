import { Permissions } from "~/enums/Permissions";
import { hasProjectPermission, protectedProcedure, router } from "../trpc";
import { string, z } from "zod";
import sceneService from "~/services/scene.service";
import { searchOptionsSchema } from "~/schemas/apiOptions";

export const sceneRouter = router({
  get: protectedProcedure
    .input(z.object({ id: z.string(), projectId: z.string() }))
    .use(hasProjectPermission(Permissions.ViewProject))
    .query(({ input: { id } }) => {
      return sceneService.get(id);
    }),
  create: protectedProcedure
    .input(z.object({ projectId: z.string(), name: z.string() }))
    .use(hasProjectPermission(Permissions.EditProject))
    .mutation(({ input: { name, projectId } }) => {
      return sceneService.create(name, projectId);
    }),
  update: protectedProcedure
    .input(
      z.object({ projectId: z.string(), sceneId: z.string(), name: z.string() })
    )
    .use(hasProjectPermission(Permissions.EditProject))
    .mutation(({ input: { name, sceneId } }) => {
      return sceneService.update(sceneId, { name });
    }),
  addFile: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        sceneId: z.string(),
        fileId: z.string(),
        name: z.string().optional(),
        transform: z.string().optional(),
        parentId: z.string().optional(),
      })
    )
    .use(hasProjectPermission(Permissions.EditProject))
    .mutation(({ input: { fileId, sceneId, name, parentId, transform } }) => {
      return sceneService.addFile(sceneId, fileId, name, parentId, transform);
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
