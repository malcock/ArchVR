import { Organisation, Prisma } from "@prisma/client";
import { Roles } from "../enums/Roles";
import { db } from "../utils/db";

class OrganisationService {
  async create(orgName: string) {
    return db.organisation.create({
      data: {
        name: orgName,
      },
    });
  }

  update(organisationId: string, data: Partial<Organisation>) {
    return db.organisation.update({
      where: {
        id: organisationId,
      },
      data,
    });
  }

  setUserRole(organisationId: string, userId: string, role: Roles) {
    return db.userOrganisations.upsert({
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
    await db.userOrganisations.update({
      data: {
        isDefault: false,
      },
      where: {
        userId_organisationId: {
          organisationId,
          userId,
        },
      },
    });
    return db.userOrganisations.update({
      data: { isDefault: true },
      where: {
        userId_organisationId: {
          organisationId,
          userId,
        },
      },
    });
  }

  removeUser(organisationId: string, userId: string) {
    return db.userOrganisations.delete({
      where: {
        userId_organisationId: {
          organisationId,
          userId,
        },
      },
    });
  }

  get(id: string) {
    return db.organisation.findUnique({
      where: {
        id,
      },
    });
  }

  members(id: string) {
    return db.organisation
      .findFirstOrThrow({
        where: {
          id,
        },
        include: {
          Members: {
            select: {
              role: true,
              User: {
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

  count(
    userId: string | undefined = undefined,
    name: string | undefined = undefined
  ) {
    return db.organisation.count({
      where: {
        ...(userId && {
          Members: {
            some: {
              userId,
            },
          },
        }),
        ...(name && {
          name: {
            contains: name,
          },
        }),
      },
    });
  }

  list(
    userId: string | undefined = undefined,
    name: string | undefined = undefined,
    take: number = 10,
    skip: number = 0,
    orderBy:
      | Prisma.Enumerable<Prisma.OrganisationOrderByWithRelationInput>
      | undefined = undefined
  ) {
    return db.organisation.findMany({
      where: {
        ...(userId && {
          Members: {
            some: {
              userId,
            },
          },
        }),
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

const organisationService = new OrganisationService();

export default organisationService;
