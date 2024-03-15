import RolePermissions from "../config/RolePermissions";
import { Permissions } from "../enums/Permissions";
import { Roles } from "../enums/Roles";
import { prisma } from "../services/prisma";

class PermissionService {
  async getUserPermissions(userId: string) {
    const perms: {
      organisations: Record<string, Roles>;
      projects: Record<string, Roles>;
    } = {
      organisations: {},
      projects: {},
    };
    perms.projects = (
      await prisma.projectRoles.findMany({
        where: {
          userId,
        },
      })
    ).reduce((obj: any, item) => {
      obj[item.projectId] = item.role;
      return obj;
    }, {});
    perms.organisations = (
      await prisma.userOrganisations.findMany({
        where: {
          userId,
        },
      })
    ).reduce((obj: any, item) => {
      obj[item.organisationId] = item.role;
      return obj;
    }, {});
    return perms;
  }
  async projectPermission(
    userId: string,
    projectId: string,
    permission: Permissions
  ) {
    try {
      console.log({ userId, projectId, permission });
      const role = Roles[
        (
          await prisma.projectRoles.findFirstOrThrow({
            where: {
              userId,
              projectId,
            },
            select: {
              role: true,
            },
          })
        ).role as Roles
      ] as keyof typeof Roles;
      if (RolePermissions[role].indexOf(permission) > -1) {
        return true;
      }
      return false;
      // throw createError({
      //   statusCode: 403,
      //   message: "You do not have sufficent permissions to perform this action",
      // });
    } catch (error) {
      console.log("project permissions error!", { error });
      return false;
      // throw createError({
      //   statusCode: 403,
      //   message: "You do not have access to this project",
      // });
    }
  }

  async organisationPermission(
    userId: string,
    organisationId: string,
    permission: Permissions
  ) {
    try {
      const role = Roles[
        (
          await prisma.userOrganisations.findFirstOrThrow({
            where: {
              organisationId,
              userId,
            },
          })
        ).role as Roles
      ] as keyof typeof Roles;

      if (RolePermissions[role].indexOf(permission) > -1) {
        return true;
      }
      return false;
      // throw createError({
      //   statusCode: 403,
      //   message: "You do not have sufficent permissions to perform this action",
      // });
    } catch (error) {
      console.log("organisation permissions error", { error });
      return false;
      // throw createError({
      //   statusCode: 403,
      //   message: "You do not have access to this organisation",
      // });
    }
  }
}

export default new PermissionService();
