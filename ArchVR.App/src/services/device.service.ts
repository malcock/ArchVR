import { Prisma, type Device } from "@prisma/client";
import { prisma } from "./prisma";
import type { SearchOptions } from "./types/SearchOptions";
import PaginatedResponse from "./types/PaginatedResponse";
class DeviceService {
  create(data: Omit<Device, "id" | "createdAt" | "updatedAt">) {
    return prisma.device.create({
      data,
    });
  }

  update(id: string, data: Omit<Device, "id" | "createdAt" | "updatedAt">) {
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

  async list(searchOptions: SearchOptions<"name"> & { projectId?: string }) {
    const { orderBy, projectId, skip, sortDirection, take, term } =
      searchOptions;

    const whereClause: Prisma.DeviceWhereInput = {
      ...(projectId && { projectId }),
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
