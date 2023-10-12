import { Elysia, t } from "elysia";
import { JwtAuth } from "../middleware/JwtAuth";
import sceneService from "../services/scene.service";
import { ProjectPermissions } from "../middleware/ProjectPermissions";
import { Permissions } from "../enums/Permissions";
import deviceService from "../services/device.service";

export default (app: Elysia) =>
  app.group(
    "scenes",
    { detail: { tags: ["Scenes"], security: [{ bearerAuth: [] }] } },
    (app) =>
      app
        .use(JwtAuth({}))
        .post(
          "",
          ({ body: { name, projectId } }) =>
            sceneService.create(name, projectId),
          {
            beforeHandle: [ProjectPermissions(Permissions.EditProject)],
            body: t.Object({
              name: t.String(),
              projectId: t.String(),
            }),
          }
        )
        .get("/:sceneId", async ({ params: { sceneId } }) => {
          const scene = await sceneService.get(sceneId);
          const devices = await deviceService.list(
            undefined,
            undefined,
            sceneId,
            100000
          );
          return {
            ...scene,
            devices,
          };
        })
        .post(
          "/:sceneId",
          async ({ body, params: { sceneId } }) => {
            const { name, parentId, fileId, transform } = body;
            const newNode = await sceneService.addNode(
              sceneId,
              name,
              transform,
              parentId,
              fileId
            );
            return newNode;
          },
          {
            beforeHandle: [ProjectPermissions(Permissions.EditProject)],
            body: t.Object({
              name: t.String(),
              parentId: t.Optional(t.String()),
              fileId: t.Optional(t.String()),
              transform: t.Optional(t.String()),
            }),
            detail: {
              summary: "Add a node to the scene",
            },
          }
        )
  );
