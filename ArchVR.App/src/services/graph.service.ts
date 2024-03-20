import type { GraphIO } from "~/GraphManager/types";
import { prisma } from "./prisma";

class GraphService {
  createSceneWidgetGraph(
    sceneId: string,
    sceneWidgetId?: string,
    file?: GraphIO
  ) {
    return prisma.sceneGraph.create({
      data: {
        sceneId,
        sceneWidgetId,
        file: file ? JSON.stringify(file) : "",
      },
    });
  }

  createObjectTransformGraph(
    sceneId: string,
    objectId: string,
    transformId: string,
    file: GraphIO
  ) {
    return prisma.sceneGraph.create({
      data: {
        file: file ? JSON.stringify(file) : "",
        sceneId,
        objectId,
        transformId,
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

  getByObjectTransform(objectId: string, transformId: string) {
    return prisma.sceneGraph.findFirstOrThrow({
      where: {
        transformId,
        objectId,
      },
    });
  }

  async get(graphId: string) {
    return prisma.sceneGraph.findFirstOrThrow({
      where: {
        id: graphId,
      },
    });
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
