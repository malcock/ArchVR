import { Elysia, t } from "elysia";
import { JwtAuth } from "../middleware/JwtAuth";
import deviceService from "../services/device.service";
import PaginatedResponse from "../types/PaginatedResponse";
import { HttpException } from "../exceptions/HttpException";
import { compare } from "bcrypt";
//TODO: Put some checks on whether user can do this...
export default (app: Elysia) =>
  app
    .use(JwtAuth({}))
    .post(
      "/devices",
      async ({
        body: { deviceType, name, organisationId, sceneId, transform },
      }) => {
        const device = await deviceService.create(
          name,
          deviceType,
          organisationId,
          sceneId,
          transform
        );

        return device;
      },
      {
        body: t.Object({
          name: t.String(),
          deviceType: t.String(),
          organisationId: t.String(),
          transform: t.Optional(t.String()),
          sceneId: t.String(),
        }),
        detail: { tags: ["Devices"], security: [{ bearerAuth: [] }] },
      }
    )
    .post(
      "/devices/login",
      async ({ body: { username, password } }) => {
        const device = await deviceService.findDeviceByUsername(username);
        const validPassword = await compare(
          password,
          device.password as string
        );
        if (!validPassword) {
          throw new HttpException(403, "Invalid device credentials");
        }
        return { bucket: "tdvp" };
      },
      {
        body: t.Object({
          username: t.String(),
          password: t.String(),
        }),
        detail: { tags: ["Devices"], security: [{ bearerAuth: [] }] },
      }
    )
    .get(
      "/devices/:deviceId",
      ({ params: { deviceId } }) => {
        return deviceService.get(deviceId);
      },
      {
        detail: { tags: ["Devices"], security: [{ bearerAuth: [] }] },
      }
    )
    .put(
      "/devices/:deviceId",
      ({ params: { deviceId }, body }) => {
        return deviceService.update(deviceId, body as any);
      },
      {
        //TODO: improve lol
        body: t.Any(),
        detail: { tags: ["Devices"], security: [{ bearerAuth: [] }] },
      }
    )
    .delete(
      "/devices/:deviceId",
      ({ params: { deviceId } }) => {
        return deviceService.delete(deviceId);
      },
      {
        detail: { tags: ["Devices"], security: [{ bearerAuth: [] }] },
      }
    )
    .post(
      "/devices/:deviceId/generate-credentials",
      ({ params: { deviceId } }) => {
        return deviceService.generateCredentials(deviceId);
      },
      {
        detail: { tags: ["Devices"], security: [{ bearerAuth: [] }] },
      }
    )
    .get(
      "/devices",
      async ({ query }) => {
        console.log(query);
        const {
          organisationId,
          searchTerm,
          sceneId,
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
        const devices = await deviceService.list(
          organisationId,
          searchTerm,
          sceneId,
          pageSize,
          Number(skip as string),
          orderBy
        );
        const total = await deviceService.count(
          organisationId,
          sceneId,
          searchTerm
        );
        type Device = (typeof devices)[0];
        const response = new PaginatedResponse<Device>(
          devices,
          pageSize,
          page,
          total
        );
        return response;
      },
      {
        query: t.Object({
          organisationId: t.Optional(t.String()),
          sceneId: t.Optional(t.String()),
          searchTerm: t.Optional(t.String()),
          take: t.Optional(t.String({ default: 10 })),
          skip: t.Optional(t.String({ default: 0 })),
          sort: t.Optional(t.Any()),
          order: t.Optional(t.Any()),
        }),
        detail: { tags: ["Devices"], security: [{ bearerAuth: [] }] },
      }
    );
