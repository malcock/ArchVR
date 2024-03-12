import { z } from "zod";
import { hasOrganisationPermission, protectedProcedure, router } from "../trpc";
import { Permissions } from "~/enums/Permissions";
import deviceService from "~/services/device.service";

export const deviceRouter = router({
  create: hasOrganisationPermission(Permissions.ViewOrganisation)
    .input(
      z.object({
        name: z.string(),
        deviceType: z.string().optional(),
        parentId: z.string().optional(),
        sceneId: z.string().optional(),
        transform: z.string().optional(),
      })
    )
    .mutation(
      ({
        input: { name, deviceType, parentId, sceneId, transform },
        ctx: {
          session: {
            user: { organisationId },
          },
        },
      }) => {
        const data = {
          name,
          deviceType,
          parentId,
          sceneId,
          transform,
          organisationId,
        };
        return deviceService.create(data);
      }
    ),
  update: hasOrganisationPermission(Permissions.ViewOrganisation)
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        deviceType: z.string().optional(),
        parentId: z.string().optional(),
        sceneId: z.string().optional(),
        transform: z.string().optional(),
      })
    )
    .mutation(
      ({
        input: { id, name, deviceType, parentId, sceneId, transform },
        ctx: {
          session: {
            user: { organisationId },
          },
        },
      }) => {
        const data = {
          name,
          deviceType,
          parentId,
          sceneId,
          transform,
          organisationId,
        };
        return deviceService.update(id, data);
      }
    ),
  get: hasOrganisationPermission(Permissions.ViewOrganisation)
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ input: { id } }) => {
      return deviceService.get(id);
    }),
});
