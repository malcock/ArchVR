import { z } from "zod";
import {
  hasOrganisationPermission,
  hasProjectPermission,
  hasSceneDevicePermission,
  middleware,
  protectedProcedure,
  router,
} from "../trpc";
import { Permissions } from "~/enums/Permissions";
import deviceService from "~/services/device.service";
import { searchOptionsSchema } from "~/schemas/apiOptions";

const deviceCreateUpdateSchema = z.object({
  name: z.string().optional(),
  unit: z.string().optional(),
  unitType: z.string().optional(),
  deviceType: z.string().optional(),
  topic: z.string().optional(),
  projectId: z.string(),
});

export const deviceRouter = router({
  create: protectedProcedure
    .input(deviceCreateUpdateSchema)
    .use(hasProjectPermission(Permissions.EditProject))
    .mutation(
      ({
        input: {
          name = null,
          unit = null,
          unitType = null,
          deviceType = null,
          topic = null,
          projectId,
        },
      }) => {
        const data = {
          name,
          unit,
          unitType,
          deviceType,
          topic,
          projectId,
        };
        return deviceService.create(data);
      }
    ),
  update: protectedProcedure
    .input(deviceCreateUpdateSchema.merge(z.object({ id: z.string() })))
    .use(hasProjectPermission(Permissions.EditProject))
    .mutation(
      ({
        input: {
          id,
          name = null,
          unit = null,
          unitType = null,
          deviceType = null,
          topic = null,
          projectId,
        },
      }) => {
        const data = {
          name,
          unit,
          unitType,
          deviceType,
          topic,
          projectId,
        };
        return deviceService.update(id, data);
      }
    ),
  get: protectedProcedure
    .input(
      z.object({
        deviceId: z.string(),
      })
    )
    .use(hasSceneDevicePermission(Permissions.ViewProject))
    .query(({ input: { deviceId } }) => {
      return deviceService.get(deviceId);
    }),
  list: protectedProcedure
    .input(
      searchOptionsSchema.merge(
        z.object({
          projectId: z.string().optional(),
          orderBy: z.enum(["name", "updatedAt", "createdAt"]).optional(),
        })
      )
    )
    .query(({ input }) => {
      return deviceService.list(input);
    }),
});

// type PropertyType<T, K extends keyof T> = T[K];
// type ArrayType<T> = T extends (infer U)[] ? U : never;
export type DeviceType = Awaited<ReturnType<typeof deviceService.get>>;
// export type SceneWidgetType = ArrayType<PropertyType<SceneType, "widgets">>;
