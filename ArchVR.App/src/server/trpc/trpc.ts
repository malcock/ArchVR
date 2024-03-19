import superjson from "superjson";
/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */
import { TRPCError, initTRPC } from "@trpc/server";
import { Context } from "~/server/trpc/context";
import { UserSession } from "~/services/auth.services";
import permissionService from "~/services/permission.service";
import { Roles } from "~/enums/Roles";
import { Permissions } from "~/enums/Permissions";
import sceneService from "~/services/scene.service";
import deviceService from "~/services/device.service";
import RolePermissions from "~/config/RolePermissions";
import graphService from "~/services/graph.service";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

//// ARGH DO I MAKE IT GET A LIST OF ALL ORGS/Project
//user has access?

/**
 * Authentication middleware
 **/
const authMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  //get all user permissions when authed/ redis one day?
  const permissions = await permissionService.getUserPermissions(
    (ctx.session.user as UserSession).id
  );

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user as UserSession },
      permissions,
    },
  });
});

const organisationPermissionsMiddleware = (permissionRequired: Permissions) =>
  authMiddleware.unstable_pipe(async ({ ctx, next }) => {
    const { user } = ctx.session;
    const { permissions } = ctx;

    const role = Roles[
      permissions.organisations[user.organisationId]
    ] as keyof typeof Roles;

    const hasPermssion = RolePermissions[role].includes(permissionRequired);

    if (!hasPermssion) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "You do not have permission to perform that action on this organisation",
      });
    }
    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user as UserSession },
      },
    });
  });

export const hasProjectPermission = (permissionRequired: Permissions) =>
  authMiddleware.unstable_pipe(async ({ ctx, input, next }) => {
    const { user } = ctx.session;
    const { projectId } = input as any;
    if (!projectId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "'projectId' missing from input",
      });
    }
    const { permissions } = ctx;

    const role = Roles[permissions.projects[projectId]] as keyof typeof Roles;

    const hasPermssion = RolePermissions[role].includes(permissionRequired);

    if (!hasPermssion) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "You do not have permission to perform that action on this project",
      });
    }
    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user as UserSession },
      },
    });
  });

export const hasSceneDevicePermission = (permissionRequired: Permissions) =>
  authMiddleware.unstable_pipe(async ({ ctx, input, next }) => {
    const { user } = ctx.session;
    const { deviceId } = input as any;
    if (!deviceId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "'deviceId' missing from input",
      });
    }
    const device = await deviceService.get(deviceId);
    const { projectId } = device;
    if (!projectId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "'projectId' missing from input",
      });
    }
    const { permissions } = ctx;

    const role = Roles[permissions.projects[projectId]] as keyof typeof Roles;

    const hasPermssion = RolePermissions[role].includes(permissionRequired);

    if (!hasPermssion) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "You do not have permission to perform that action on this project",
      });
    }
    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user as UserSession },
      },
    });
  });

export const hasSceneWidgetPermission = (permissionRequired: Permissions) =>
  authMiddleware.unstable_pipe(async ({ ctx, input, next }) => {
    const { user } = ctx.session;
    const { graphId } = input as any;
    if (!graphId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "'graphId' missing from input",
      });
    }
    const projectId = await graphService.getProjectId(graphId);

    if (!projectId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "'projectId' missing from input",
      });
    }
    const { permissions } = ctx;

    const role = Roles[permissions.projects[projectId]] as keyof typeof Roles;

    const hasPermssion = RolePermissions[role].includes(permissionRequired);

    if (!hasPermssion) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "You do not have permission to perform that action on this project",
      });
    }
    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user as UserSession },
      },
    });
  });

export const hasScenePermission = (permissionRequired: Permissions) =>
  authMiddleware.unstable_pipe(async ({ ctx, input, next }) => {
    const { user } = ctx.session;
    const { sceneId } = input as any;
    if (!sceneId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "'sceneId' missing from input",
      });
    }
    const scene = await sceneService.getProjectId(sceneId);
    const { projectId } = scene;
    if (!projectId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "'projectId' missing from input",
      });
    }
    const { permissions } = ctx;

    const role = Roles[permissions.projects[projectId]] as keyof typeof Roles;

    const hasPermssion = RolePermissions[role].includes(permissionRequired);

    if (!hasPermssion) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "You do not have permission to perform that action on this project",
      });
    }
    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user as UserSession },
      },
    });
  });

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(authMiddleware);
export const hasOrganisationPermission = (permissionRequired: Permissions) =>
  t.procedure.use(organisationPermissionsMiddleware(permissionRequired));

export const router = t.router;
export const middleware = t.middleware;
