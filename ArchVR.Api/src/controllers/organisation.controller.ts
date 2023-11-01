import { Elysia, t } from "elysia";
import { JwtAuth } from "../middleware/JwtAuth";
import organisationService from "../services/organisation.service";
import { Roles } from "../enums/Roles";
import PaginatedResponse from "../types/PaginatedResponse";
import { Device, Organisation } from "@prisma/client";
import { OrganisationPermissons } from "../middleware/OrganisationPermission";
import { Permissions } from "../enums/Permissions";
import projectService from "../services/project.service";
import deviceService from "../services/device.service";

export default (app: Elysia) =>
  app.group(
    "organisations",
    { detail: { tags: ["Organisations"], security: [{ bearerAuth: [] }] } },
    (app) =>
      app
        .use(JwtAuth({}))
        .post(
          "",
          async ({ body: { name }, auth: { userId } }) => {
            const org = await organisationService.create(name);
            await organisationService.setUserRole(org.id, userId, Roles.Owner);
            return org;
          },
          {
            body: t.Object({
              name: t.String(),
            }),
          }
        )
        .get(
          "",
          async ({ auth: { userId }, query }) => {
            const { searchTerm, take = 10, skip = 0, sort, order } = query;
            let orderBy: Record<string, string> = {};
            if (sort) {
              orderBy = {};
              orderBy[sort as string] = order || "asc";
            }
            const pageSize = Number(take as string);
            const page = 1 + Number(skip) / pageSize;
            const orgs = await organisationService.list(
              userId,
              searchTerm as string,
              pageSize,
              Number(skip as string),
              orderBy
            );
            const total = await organisationService.count(
              userId,
              searchTerm as string
            );

            const response = new PaginatedResponse<Organisation>(
              orgs,
              pageSize,
              page,
              total
            );
            return response;
          },
          {
            query: t.Object({
              searchTerm: t.Optional(t.String()),
              take: t.Optional(t.String({ default: 10 })),
              skip: t.Optional(t.String({ default: 0 })),
              sort: t.Optional(t.Any()),
              order: t.Optional(t.Any()),
            }),
          }
        )
        .get(
          "/:organisationId",
          ({ params: { organisationId } }) =>
            organisationService.get(organisationId),
          {
            beforeHandle: [
              OrganisationPermissons(Permissions.ViewOrganisation),
            ],
          }
        )
        .put(
          "/:organisationId",
          ({ params: { organisationId }, body }) => {
            organisationService.update(organisationId, body);
          },
          {
            beforeHandle: [
              OrganisationPermissons(Permissions.EditOrganisation),
            ],
            body: t.Object({
              customerId: t.Optional(t.String()),
              name: t.Optional(t.String()),
              id: t.Optional(t.String()),
            }),
          }
        )
        .get(
          "/:organisationId/members",
          ({ params: { organisationId } }) => {
            return organisationService.members(organisationId);
          },
          {
            beforeHandle: [
              OrganisationPermissons(Permissions.ViewOrganisation),
            ],
          }
        )
        .post(
          "/:organisationId/members",
          async ({
            set,
            body: { role, userId },
            params: { organisationId },
          }) => {
            const newUserRole = organisationService.setUserRole(
              organisationId,
              userId,
              role
            );
            set.status = 201;
            return newUserRole;
          },
          {
            beforeHandle: [
              OrganisationPermissons(Permissions.EditOrganisationRoles),
            ],
            body: t.Object({
              userId: t.String(),
              role: t.Number(),
            }),
          }
        )
        .put(
          "/:organisationId/members/:userId",
          ({ params: { organisationId, userId }, body: { role } }) => {
            return organisationService.setUserRole(
              organisationId,
              userId,
              role
            );
          },
          {
            beforeHandle: [
              OrganisationPermissons(Permissions.EditProjectRoles),
            ],
            body: t.Object({
              role: t.Number(),
            }),
          }
        )
        .delete(
          "/:organisationId/members/:userId",
          ({ params: { organisationId, userId } }) =>
            organisationService.removeUser(organisationId, userId),
          {
            beforeHandle: [
              OrganisationPermissons(Permissions.EditProjectRoles),
            ],
          }
        )
        .get(
          "/:organisationId/projects",
          async ({ query, params: { organisationId } }) => {
            const { searchTerm, take = 10, skip = 0, sort, order } = query;
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
              searchTerm: t.Optional(t.String()),
              take: t.Optional(t.String({ default: 10 })),
              skip: t.Optional(t.String({ default: 0 })),
              sort: t.Optional(t.Any()),
              order: t.Optional(t.Any()),
            }),
          }
        )
        // .post(
        //   "/:organisationId/projects",
        //   async ({
        //     body: { name },
        //     params: { organisationId },
        //     auth: { userId },
        //   }) => {
        //     const proj = await projectService.create(name, organisationId);
        //     await projectService.setUserRole(proj.id, userId, Roles.Owner);
        //     return proj;
        //   },
        //   {
        //     beforeHandle: [OrganisationPermissons(Permissions.CreateProjects)],
        //     body: t.Object({
        //       name: t.String(),
        //     }),
        //   }
        // )
        .get(
          "/:organisationId/devices",
          async ({ query, params: { organisationId } }) => {
            const { searchTerm, take = "10", skip = "0", sort, order } = query;

            let orderBy: Record<string, string> = {};
            if (sort) {
              orderBy = {};
              orderBy[sort as string] = order || "asc";
            }
            const pageSize = Number(take as string);
            const page = 1 + Number(skip) / pageSize;
            const projs = await deviceService.list(
              organisationId,
              searchTerm,
              undefined,
              pageSize,
              Number(skip as string),
              orderBy
            );

            const total = await deviceService.count(
              organisationId as string,
              searchTerm as string
            );

            const response = new PaginatedResponse<Device>(
              projs,
              pageSize,
              page,
              total
            );
            return response;
          },
          {
            beforeHandle: [
              OrganisationPermissons(Permissions.ViewOrganisation),
            ],
            query: t.Object({
              searchTerm: t.Optional(t.String()),
              take: t.Optional(t.String({ default: 10 })),
              skip: t.Optional(t.String({ default: 0 })),
              sort: t.Optional(t.Any()),
              order: t.Optional(t.Any()),
            }),
          }
        )
  );
