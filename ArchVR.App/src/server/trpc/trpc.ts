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

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

/**
 * Authentication middleware
 **/
const authMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  console.log(ctx.session);
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user as UserSession },
    },
  });
});

const organisationPermissionsMiddleware = (permissionRequired: Permissions) =>
  authMiddleware.unstable_pipe(async ({ ctx, next }) => {
    const { user } = ctx.session;
    console.log("org perm middle", Permissions[permissionRequired], { user });
    const hasPermssion = permissionService.organisationPermission(
      user.id,
      user.organisationId,
      permissionRequired
    );
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
  authMiddleware.unstable_pipe(({ ctx, input, next }) => {
    const { user } = ctx.session;
    console.log("1", { input });
    const { projectId } = input as any;
    console.log("2");
    if (!projectId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "'projectId' missing from input",
      });
    }
    const hasPermssion = permissionService.projectPermission(
      user.id,
      projectId,
      permissionRequired
    );
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
