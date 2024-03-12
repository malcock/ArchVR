import { Prisma, type Device } from "@prisma/client";
import { prisma } from "./prisma";
import type { SearchOptions } from "./types/SearchOptions";
import PaginatedResponse from "./types/PaginatedResponse";
class DeviceService {
  create(data: {
    name: string;
    organisationId: string;
    deviceType?: string;
    sceneId?: string;
    transform?: string;
    parentId?: string;
  }) {
    return prisma.device.create({
      data,
    });
  }

  update(
    id: string,
    data: {
      name: string;
      organisationId: string;
      deviceType?: string;
      sceneId?: string;
      transform?: string;
      parentId?: string;
    }
  ) {
    return prisma.device.update({
      where: {
        id,
      },
      data,
    });
  }

  get(id: string) {
    return prisma.device.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  delete(id: string) {
    return prisma.device.delete({
      where: {
        id,
      },
    });
  }

  async list(
    searchOptions: SearchOptions<"name"> & { organisationId?: string }
  ) {
    const { orderBy, organisationId, skip, sortDirection, take, term } =
      searchOptions;

    const whereClause: Prisma.DeviceWhereInput = {
      ...(organisationId && { organisationId }),
      ...(term && {
        name: {
          contains: term,
        },
      }),
    };
    const totalCount = await prisma.device.count({ where: whereClause });
    const items = await prisma.device.findMany({
      where: whereClause,
      orderBy: orderBy ? { [orderBy]: sortDirection || "asc" } : undefined,
      take: take || 10,
      skip: skip || 0,
    });

    const pageSize = take || 10;
    const page = Math.floor((skip as number) / pageSize) + 1;

    return new PaginatedResponse(items, pageSize, page, totalCount);
  }
}
export default new DeviceService();
