import RolePermissions from "../config/RolePermissions";
import { Permissions } from "../enums/Permissions";
import { Roles } from "../enums/Roles";
import { HttpException } from "../exceptions/HttpException";
import { db } from "../utils/db";

class PermissionService {
  async projectPermission(
    userId: string,
    projectId: string,
    permission: Permissions
  ) {
    try {
      const role =
        Roles[
          (
            await db.projectRoles.findFirstOrThrow({
              where: {
                userId,
                projectId,
              },
              select: {
                role: true,
              },
            })
          ).role as Roles
        ];
      if (RolePermissions[role].indexOf(permission) > -1) {
        return true;
      }
      throw new HttpException(
        403,
        "You do not have sufficent permissions to perform this action"
      );
    } catch (error) {
      throw new HttpException(403, "You do not have access to this project");
    }
  }

  async organisationPermission(
    userId: string,
    organisationId: string,
    permission: Permissions
  ) {
    try {
      const role =
        Roles[
          (
            await db.userOrganisations.findFirstOrThrow({
              where: {
                organisationId,
                userId,
              },
            })
          ).role as Roles
        ];

      if (RolePermissions[role].indexOf(permission) > -1) {
        return true;
      }
      throw new HttpException(
        403,
        "You do not have sufficent permissions to perform this action"
      );
    } catch (error) {
      console.log(error);
      throw new HttpException(
        403,
        "You do not have access to this organisation"
      );
    }
  }
}

const permissionService = new PermissionService();

export default permissionService;
