import type { GraphIO } from "~/rete/types";
import { prisma } from "./prisma";

class GraphService {
  create(sceneId: string, sceneWidgetId?: string, file?: GraphIO) {
    return prisma.sceneGraph.create({
      data: {
        sceneId,
        sceneWidgetId,
        file: file ? JSON.stringify(file) : "",
      },
    });
  }

  update(graphId: string, file: GraphIO) {
    return prisma.sceneGraph.update({
      where: {
        id: graphId,
      },
      data: {
        file: JSON.stringify(file),
      },
    });
  }

  async get(graphId: string) {
    const graph = await prisma.sceneGraph.findFirstOrThrow({
      where: {
        id: graphId,
      },
    });

    const { file, ...rest } = graph;
    return {
      ...rest,
      file: JSON.parse(file) as GraphIO,
    };
  }
  async getProjectId(graphId: string) {
    return (
      await prisma.sceneGraph.findFirstOrThrow({
        where: {
          id: graphId,
        },
        select: {
          scene: {
            select: {
              projectId: true,
            },
          },
        },
      })
    ).scene.projectId;
  }
}

export default new GraphService();
