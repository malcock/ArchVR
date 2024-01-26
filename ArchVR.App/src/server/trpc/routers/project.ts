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
import permissionService from "~/services/permission.service";
import { Permissions } from "~/enums/Permissions";

export const projectRouter = router({
  get: hasProjectPermission(Permissions.ViewProject)
    .input(z.object({ projectId: z.string() }))
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
      // if(!permissionService.organisationPermission(ctx.session.user.))
      return projectService.create(input.name, organisationId);
    }),
  update: hasProjectPermission(Permissions.EditProject)
    .input(
      z.object({
        name: z.string(),
        id: z.string(),
      })
    )
    .mutation(({ input: { id, name } }) => {
      return projectService.update(id, { name });
    }),
  setUserRole: hasProjectPermission(Permissions.EditProjectRoles)
    .input(
      z.object({
        projectId: z.string(),
        userId: z.string(),
        role: z.nativeEnum(Roles),
      })
    )
    .mutation(({ input: { projectId, role, userId } }) => {
      return projectService.setUserRole(projectId, userId, role);
    }),
  removeUser: hasProjectPermission(Permissions.EditProjectRoles)
    .input(
      z.object({
        projectId: z.string(),
        userId: z.string(),
      })
    )
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
