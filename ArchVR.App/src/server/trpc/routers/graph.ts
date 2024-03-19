import { z } from "zod";
import {
  hasScenePermission,
  hasSceneWidgetPermission,
  protectedProcedure,
  router,
} from "../trpc";
import { Permissions } from "~/enums/Permissions";
import graphService from "~/services/graph.service";

export const ConnectionSchema = z.object({
  source: z.string(),
  sourceOutput: z.string(),
  target: z.string(),
  targetInput: z.string(),
});

export const GraphNodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  data: z.record(z.any()), // Accepts any value for data object properties
});

export const GraphIOSchema = z.object({
  id: z.string().optional(),
  nodes: z.array(GraphNodeSchema),
  connections: z.array(ConnectionSchema),
});

export const graphRouter = router({
  createSceneWidgetGraph: protectedProcedure
    .input(
      z.object({
        sceneId: z.string(),
        sceneWidgetId: z.string(),
        file: GraphIOSchema,
      })
    )
    .use(hasScenePermission(Permissions.EditProject))
    .mutation(({ input: { file, sceneId, sceneWidgetId } }) => {
      return graphService.create(sceneId, sceneWidgetId, file);
    }),
  update: protectedProcedure
    .input(
      z.object({
        graphId: z.string(),
        file: GraphIOSchema,
      })
    )
    .use(hasSceneWidgetPermission(Permissions.EditProject))
    .mutation(({ input: { file, graphId } }) => {
      return graphService.update(graphId, file);
    }),
  get: protectedProcedure
    .input(
      z.object({
        graphId: z.string(),
      })
    )
    .use(hasSceneWidgetPermission(Permissions.ViewProject))
    .query(({ input: { graphId } }) => {
      return graphService.get(graphId);
    }),
});
export type GraphType = Awaited<ReturnType<typeof graphService.get>>;
