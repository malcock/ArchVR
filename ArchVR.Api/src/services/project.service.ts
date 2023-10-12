import { Prisma, Project } from "@prisma/client";
import { Roles } from "../enums/Roles";
import { db } from "../utils/db";

class ProjectService {
  create(name: string, organisationId: string) {
    return db.project.create({
      data: {
        name,
        organisationId,
      },
    });
  }

  update(projectId: string, data: Partial<Project>) {
    return db.project.update({
      where: {
        id: projectId,
      },
      data,
    });
  }

  setUserRole(projectId: string, userId: string, role: Roles) {
    return db.projectRoles.upsert({
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
    return db.projectRoles.delete({
      where: {
        userId_projectId: {
          projectId,
          userId,
        },
      },
    });
  }

  get(id: string) {
    return db.project.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  members(id: string) {
    return db.project.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        ProjectRoles: {
          select: { role: true },
          include: {
            User: {
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

  count(
    organisationId: string | undefined = undefined,
    name: string | undefined = undefined
  ) {
    return db.project.count({
      where: {
        ...(organisationId && { organisationId }),
        ...(name && {
          name: {
            contains: name,
          },
        }),
      },
    });
  }

  list(
    organisationId: string | undefined = undefined,
    name: string | undefined = undefined,
    take: number = 10,
    skip: number = 0,
    orderBy:
      | Prisma.Enumerable<Prisma.ProjectOrderByWithRelationInput>
      | undefined = undefined
  ) {
    return db.project.findMany({
      where: {
        ...(organisationId && { organisationId }),
        ...(name && {
          name: {
            contains: name,
          },
        }),
      },
      take,
      skip,
      orderBy,
    });
  }
}

const projectService = new ProjectService();

export default projectService;
