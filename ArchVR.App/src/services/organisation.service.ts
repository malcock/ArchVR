import { type Organisation, Prisma } from "@prisma/client";
import { Roles } from "../enums/Roles";
import { prisma } from "./prisma";
import type { SearchOptions } from "./types/SearchOptions";
import PaginatedResponse from "./types/PaginatedResponse";

class OrganisationService {
  async create(orgName: string) {
    return prisma.organisation.create({
      data: {
        name: orgName,
      },
    });
  }

  update(organisationId: string, data: Partial<Organisation>) {
    return prisma.organisation.update({
      where: {
        id: organisationId,
      },
      data,
    });
  }

  setUserRole(organisationId: string, userId: string, role: Roles) {
    return prisma.userOrganisations.upsert({
      where: {
        userId_organisationId: { organisationId, userId },
      },
      create: {
        role,
        userId,
        organisationId,
      },
      update: {
        role,
      },
    });
  }

  async setUserDefaultOrganisation(organisationId: string, userId: string) {
    return prisma.userOrganisations.update({
      data: { defaultAt: new Date() },
      where: {
        userId_organisationId: {
          organisationId,
          userId,
        },
      },
    });
  }

  removeUser(organisationId: string, userId: string) {
    return prisma.userOrganisations.delete({
      where: {
        userId_organisationId: {
          organisationId,
          userId,
        },
      },
    });
  }

  get(id: string) {
    return prisma.organisation.findUnique({
      where: {
        id,
      },
    });
  }

  members(id: string) {
    return prisma.organisation
      .findFirstOrThrow({
        where: {
          id,
        },
        include: {
          members: {
            select: {
              role: true,
              user: {
                select: {
                  email: true,
                  id: true,
                  name: true,
                },
              },
              updatedAt: true,
            },
          },
        },
      })
      .catch((err) => {
        console.log({ err });
      });
  }

  async list(searchOptions: SearchOptions<Organisation> & { userId: string }) {
    const { term, orderBy, sortDirection, take, skip, userId } = searchOptions;
    const whereClause: Prisma.OrganisationWhereInput = {
      ...(userId && {
        members: {
          some: {
            userId,
          },
        },
      }),
      ...(term && {
        name: {
          contains: term,
        },
      }),
    };

    const totalCount = await prisma.organisation.count({ where: whereClause });
    const items = await prisma.organisation.findMany({
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

export default new OrganisationService();
