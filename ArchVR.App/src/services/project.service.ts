import { Prisma, type Project } from "@prisma/client";
import { Roles } from "../enums/Roles";
import { prisma } from "./prisma";
import type { SearchOptions } from "./types/SearchOptions";
import PaginatedResponse from "./types/PaginatedResponse";

class ProjectService {
  create(name: string, organisationId: string) {
    return prisma.project.create({
      data: {
        name,
        organisationId,
      },
    });
  }

  update(projectId: string, data: Partial<Project>) {
    return prisma.project.update({
      where: {
        id: projectId,
      },
      data,
    });
  }

  setUserRole(projectId: string, userId: string, role: Roles) {
    return prisma.projectRoles.upsert({
      where: {
        userId_projectId: { projectId, userId },
      },
      create: {
        role,
        projectId,
        userId,
      },
      update: { role },
    });
  }

  removeUser(projectId: string, userId: string) {
    return prisma.projectRoles.delete({
      where: {
        userId_projectId: {
          projectId,
          userId,
        },
      },
    });
  }

  get(id: string) {
    return prisma.project.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  members(id: string) {
    return prisma.project.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        projectRoles: {
          select: { role: true },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async list(
    searchOptions: SearchOptions<Omit<Project, "id" | "organisationId">> & {
      organisationId?: string;
    }
  ) {
    const { term, orderBy, sortDirection, take, skip, organisationId } =
      searchOptions;

    const whereClause: Prisma.ProjectWhereInput = {
      ...(organisationId && { organisationId }),
      ...(term && {
        name: {
          contains: term,
        },
      }),
    };

    const totalCount = await prisma.project.count({ where: whereClause });
    const items = await prisma.project.findMany({
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

export default new ProjectService();
