import { Elysia, t } from "elysia";
import projectService from "../services/project.service";
import { JwtAuth } from "../middleware/JwtAuth";
import PaginatedResponse from "../types/PaginatedResponse";
import { Project, Scene } from "@prisma/client";
import { ProjectPermissions } from "../middleware/ProjectPermissions";
import { Permissions } from "../enums/Permissions";
import sceneService from "../services/scene.service";
import { OrganisationPermissons } from "../middleware/OrganisationPermission";

export default (app: Elysia) =>
  app.group(
    "projects",
    { detail: { tags: ["Projects"], security: [{ bearerAuth: [] }] } },
    (app) =>
      app
        .use(
          JwtAuth({
            exclude: [],
          })
        )
        .post(
          "",
          async ({ body: { name, organisationId } }) => {
            const proj = await projectService.create(name, organisationId);

            return proj;
          },
          {
            body: t.Object({
              name: t.String(),
              organisationId: t.String(),
            }),
            beforeHandle: [OrganisationPermissons(Permissions.CreateProjects)],
          }
        )
        .get(
          "",
          async ({ query }) => {
            console.log(query);
            const {
              organisationId,
              searchTerm,
              take = 10,
              skip = 0,
              sort,
              order,
            } = query;
            let orderBy: Record<string, string> = {};
            if (sort) {
              orderBy = {};
              orderBy[sort as string] = order || "asc";
            }
            const pageSize = Number(take as string);
            const page = 1 + Number(skip) / pageSize;
            const projs = await projectService.list(
              organisationId as string,
              searchTerm as string,
              pageSize,
              Number(skip as string),
              orderBy
            );

            const total = await projectService.count(
              organisationId as string,
              searchTerm as string
            );
            type Project = (typeof projs)[0];
            const response = new PaginatedResponse<Project>(
              projs,
              pageSize,
              page,
              total
            );
            return response;
          },
          {
            query: t.Object({
              organisationId: t.Optional(t.String()),
              searchTerm: t.Optional(t.String()),
              take: t.Optional(t.String({ default: 10 })),
              skip: t.Optional(t.String({ default: 0 })),
              sort: t.Optional(t.Any()),
              order: t.Optional(t.Any()),
            }),
          }
        )
        .get("/:projectId", ({ params: { projectId } }) =>
          projectService.get(projectId)
        )
        .put(
          "/:projectId",
          ({ params: { projectId }, body }) =>
            projectService.update(projectId, body),
          {
            beforeHandle: [ProjectPermissions(Permissions.EditProject)],
            body: t.Object({
              id: t.Optional(t.String()),
              name: t.Optional(t.String()),
              organisationId: t.Optional(t.String()),
            }),
          }
        )
        .get(
          "/:projectId/scenes",
          async ({ params: { projectId }, query }) => {
            const { searchTerm, take = 10, skip = 0, sort, order } = query;
            let orderBy: Record<string, string> = {};
            if (sort) {
              orderBy = {};
              orderBy[sort as string] = order || "asc";
            }
            const pageSize = Number(take as string);
            const page = 1 + Number(skip) / pageSize;
            const scenes = await sceneService.list(
              projectId,
              searchTerm as string,
              pageSize,
              Number(skip as string),
              orderBy
            );

            const total = await sceneService.count(
              projectId,
              searchTerm as string
            );
            const response = new PaginatedResponse<Scene>(
              scenes,
              pageSize,
              page,
              total
            );
            return response;
          },
          {
            beforeHandle: [ProjectPermissions(Permissions.ViewProject)],
            query: t.Object({
              searchTerm: t.Optional(t.String()),
              take: t.Optional(t.String({ default: 10 })),
              skip: t.Optional(t.String({ default: 0 })),
              sort: t.Optional(t.Any()),
              order: t.Optional(t.Any()),
            }),
          }
        )
        .post(
          "/:projectId/scenes",
          ({ body: { name }, params: { projectId } }) =>
            sceneService.create(name, projectId),
          {
            beforeHandle: [ProjectPermissions(Permissions.EditProject)],
            body: t.Object({
              name: t.String(),
            }),
          }
        )
        .get(
          "/:projectId/members",
          ({ params: { projectId } }) => projectService.members(projectId),
          {
            beforeHandle: [ProjectPermissions(Permissions.EditProjectRoles)],
          }
        )
        .post(
          "/:projectId/members",
          ({ set, params: { projectId }, body: { role, userId } }) => {
            const newUserRole = projectService.setUserRole(
              projectId,
              userId,
              role
            );
            set.status = 201;
            return newUserRole;
          },
          {
            beforeHandle: [ProjectPermissions(Permissions.EditProjectRoles)],
            body: t.Object({
              userId: t.String(),
              role: t.Number(),
            }),
          }
        )
        .put(
          "/:projectId/members/:userId",
          ({ params: { projectId, userId }, body: { role } }) => {
            return projectService.setUserRole(projectId, userId, role);
          },
          {
            beforeHandle: [ProjectPermissions(Permissions.EditProjectRoles)],
            body: t.Object({
              role: t.Number(),
            }),
          }
        )
        .delete(
          "/:projectId/members/:userId",
          ({ params: { projectId, userId } }) =>
            projectService.removeUser(projectId, userId),
          {
            beforeHandle: [ProjectPermissions(Permissions.EditProjectRoles)],
          }
        )
  );
