import { Permissions } from "../enums/Permissions";
import { HttpException } from "../exceptions/HttpException";
import permissionService from "../services/permission.service";

export const OrganisationPermissons =
  (permissionRequired: Permissions) =>
  async ({ auth, params, body }: any) => {
    console.log({ auth, params, body });
    const { userId } = auth;
    const organisationId =
      auth.organisationId || params.organisationId || body.organisationId;
    if (!userId || !organisationId) {
      throw new HttpException(401, "Unauthorized");
    }
    await permissionService.organisationPermission(
      userId,
      organisationId,
      permissionRequired
    );
  };
