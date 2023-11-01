import { Context, Handler } from "elysia";
import { JwtAuthed } from "./JwtAuth";
import { Permissions } from "../enums/Permissions";
import { HttpException } from "../exceptions/HttpException";
import permissionService from "../services/permission.service";

export const ProjectPermissions =
  (permissionRequired: Permissions) =>
  async ({ auth: { userId }, params, body }: any) => {
    console.log({ params, body });
    const projectId = params.projectId || body.projectId;
    if (!userId || !projectId) {
      throw new HttpException(401, "Unauthorized");
    }

    await permissionService.projectPermission(
      userId,
      projectId as string,
      permissionRequired
    );
  };
