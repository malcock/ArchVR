import { z } from "zod";
import {
  hasScenePermission,
  hasSceneWidgetPermission,
  protectedProcedure,
  router,
} from "../trpc";
import { Permissions } from "~/enums/Permissions";
import graphService from "~/services/graph.service";
import sceneService from "~/services/scene.service";

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
    .mutation(async ({ input: { file, sceneId, sceneWidgetId } }) => {
      const g = await graphService.createSceneWidgetGraph(sceneId, file);
      await sceneService.setWidget(sceneWidgetId, { graphId: g.id });
      return g;
    }),
  createObjectTransformGraph: protectedProcedure
    .input(
      z.object({
        file: GraphIOSchema,
        sceneId: z.string(),
        objectId: z.string(),
        transformId: z.string(),
      })
    )
    .use(hasScenePermission(Permissions.EditProject))
    .mutation(({ input: { file, objectId, sceneId, transformId } }) => {
      return graphService.createObjectTransformGraph(
        sceneId,
        objectId,
        transformId,
        file
      );
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
  getByObjectTransform: protectedProcedure
    .input(
      z.object({
        transformId: z.string(),
        objectId: z.string(),
      })
    )

    .query(({ input: { objectId, transformId } }) => {
      return graphService.getByObjectTransform(objectId, transformId);
    }),
});
export type GraphType = Awaited<ReturnType<typeof graphService.get>>;
