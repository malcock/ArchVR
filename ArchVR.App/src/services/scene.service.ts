import { Prisma, type Scene, type SceneWidgets } from "@prisma/client";
import { prisma } from "./prisma";
import type { SearchOptions } from "./types/SearchOptions";
import PaginatedResponse from "./types/PaginatedResponse";

class SceneService {
  private recursive(level: number): any {
    if (level === 0) {
      return {
        include: {
          parent: true,
        },
      };
    }
    return {
      include: {
        parent: this.recursive(level - 1),
      },
    };
  }
  create(name: string, projectId: string) {
    return prisma.scene.create({
      data: {
        name,
        projectId,
      },
    });
  }

  update(id: string, data: Partial<Scene>) {
    return prisma.scene.update({
      where: {
        id,
      },
      data,
    });
  }

  get(id: string) {
    return prisma.scene.findUniqueOrThrow({
      where: { id },
      include: {
        files: {
          select: {
            file: {
              select: {
                processed: true,
                thumbnail: true,
              },
            },
            fileId: true,
            transform: true,
            name: true,
          },
        },
        children: true,
        parent: this.recursive(5),
        project: true,
        devices: {
          select: {
            id: true,
            transform: true,
            deviceId: true,
          },
        },
        widgets: {
          select: {
            id: true,
            sceneId: true,
            name: true,
            widgetType: {
              select: {
                component: true,
                name: true,
              },
            },
            position: true,

            graph: {
              select: {
                id: true,
                file: true,
              },
            },
          },
        },
        graphs: true,
      },
    });
  }
  getProjectId(sceneId: string) {
    return prisma.scene.findUniqueOrThrow({
      where: {
        id: sceneId,
      },
      select: {
        projectId: true,
      },
    });
  }
  async list(
    searchOptions: SearchOptions<Omit<Scene, "id" | "organisationId">> & {
      projectId?: string;
    }
  ) {
    const { term, orderBy, sortDirection, take, skip, projectId } =
      searchOptions;

    const whereClause: Prisma.SceneWhereInput = {
      ...(projectId && { projectId }),
      ...(term && {
        name: {
          contains: term,
        },
      }),
    };

    const totalCount = await prisma.scene.count({ where: whereClause });
    const items = await prisma.scene.findMany({
      where: whereClause,
      orderBy: orderBy ? { [orderBy]: sortDirection || "asc" } : undefined,
      take: take || 10,
      skip: skip || 0,
    });

    const pageSize = take || 10;
    const page = Math.floor((skip as number) / pageSize) + 1;

    return new PaginatedResponse(items, pageSize, page, totalCount);
  }

  addFile(
    sceneId: string,
    fileId: string,
    name?: string,
    parentId?: string,
    transform?: string
  ) {
    return prisma.sceneFiles.create({
      data: {
        sceneId,
        fileId,
        name,
        transform,
        parentId,
      },
      include: {
        file: {
          select: {
            processed: true,
            thumbnail: true,
          },
        },
      },
    });
  }

  addDevice(sceneId: string, transform: string) {
    return prisma.sceneDevices.create({
      data: {
        sceneId,
        transform,
      },
    });
  }

  setSceneDevice(sceneDeviceId: string, deviceId: string, transform: string) {
    return prisma.sceneDevices.update({
      where: {
        id: sceneDeviceId,
      },
      data: {
        deviceId,
        transform,
      },
    });
  }

  getSceneDevice(id: string) {
    return prisma.sceneDevices.findFirstOrThrow({
      where: {
        id,
      },
    });
  }

  listSceneDevices(sceneId: string) {
    return prisma.sceneDevices.findMany({
      where: {
        sceneId,
      },
    });
  }

  addWidget(sceneId: string, widgetTypeId?: string, name?: string) {
    return prisma.sceneWidgets.create({
      data: {
        sceneId,
        name,
        widgetTypeId,
      },
      select: {
        id: true,
        name: true,
        widgetType: {
          select: {
            component: true,
            name: true,
          },
        },
        position: true,
        sceneId: true,
        graph: {
          select: {
            id: true,
            file: true,
          },
        },
      },
    });
  }

  setWidget(id: string, data: Partial<SceneWidgets>) {
    return prisma.sceneWidgets.update({
      where: {
        id,
      },
      data,
    });
  }
}

export default new SceneService();
