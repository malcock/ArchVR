import { z } from "zod";
import { hasOrganisationPermission, router } from "../trpc";
import { searchOptionsSchema } from "~/schemas/apiOptions";
import { Permissions } from "~/enums/Permissions";
import fileService from "~/services/file.service";
export const fileRouter = router({
  list: hasOrganisationPermission(Permissions.ViewOrganisation)
    .input(
      searchOptionsSchema.merge(
        z.object({
          organisationId: z.string().optional(),
          orderBy: z.enum(["name", "updatedAt", "createdAt"]).optional(),
        })
      )
    )
    .query(({ input, ctx }) => {
      return fileService.list(input);
    }),
});
