import { Prisma, type Scene } from "@prisma/client";
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
        files: true,
        children: true,
        parent: this.recursive(5),
        project: true,
        devices: {
          select: {
            id: true,
            name: true,
            transform: true,
            deviceType: true,
          },
        },
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
    });
  }

  addDevice(sceneId: string, deviceId: string) {
    return prisma.device.update({
      where: {
        id: deviceId,
      },
      data: {
        sceneId,
      },
    });
  }
}

export default new SceneService();
