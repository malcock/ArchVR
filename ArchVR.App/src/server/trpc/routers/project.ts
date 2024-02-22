import { z } from "zod";
import {
  hasOrganisationPermission,
  hasProjectPermission,
  protectedProcedure,
  router,
} from "../trpc";
import projectService from "~/services/project.service";
import { searchOptionsSchema } from "~/schemas/apiOptions";
import { Roles } from "~/enums/Roles";
import { Permissions } from "~/enums/Permissions";

export const projectRouter = router({
  get: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .use(hasProjectPermission(Permissions.ViewProject))
    .query(({ input: { projectId } }) => {
      return projectService.get(projectId);
    }),
  create: hasOrganisationPermission(Permissions.CreateProjects)
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { organisationId } = ctx.session.user;
      const project = await projectService.create(input.name, organisationId);
      await projectService.setUserRole(
        project.id,
        ctx.session.user.id,
        Roles.Owner
      );
      // if(!permissionService.organisationPermission(ctx.session.user.))
      return project;
    }),
  update: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        projectId: z.string(),
      })
    )
    .use(hasProjectPermission(Permissions.ViewProject))
    .mutation(({ input: { projectId, name } }) => {
      return projectService.update(projectId, { name });
    }),
  setUserRole: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        userId: z.string(),
        role: z.nativeEnum(Roles),
      })
    )
    .use(hasProjectPermission(Permissions.ViewProject))
    .mutation(({ input: { projectId, role, userId } }) => {
      return projectService.setUserRole(projectId, userId, role);
    }),
  removeUser: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        userId: z.string(),
      })
    )
    .use(hasProjectPermission(Permissions.ViewProject))
    .mutation(({ input: { projectId, userId } }) => {
      return projectService.removeUser(projectId, userId);
    }),
  list: hasOrganisationPermission(Permissions.ListProjects)
    .input(
      searchOptionsSchema.merge(
        z.object({
          organisationId: z.string().optional(),
          orderBy: z.enum(["name", "updatedAt", "createdAt"]).optional(),
        })
      )
    )
    .query(({ input, ctx }) => {
      return projectService.list(input);
    }),
});
