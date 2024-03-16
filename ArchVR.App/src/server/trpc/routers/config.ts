import configService from "~/services/config.service";
import { protectedProcedure, router } from "../trpc";

export const configRouter = router({
  widgetTypes: protectedProcedure.query(() => {
    return configService.getWidgetTypes();
  }),
});
