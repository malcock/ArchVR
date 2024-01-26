import bcrypt, { compare } from "bcrypt";
import { prisma } from "./prisma";
import { type User } from "@prisma/client";

function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      accounts: {
        select: {
          provider: true,
        },
      },
      userOrganisations: {
        select: {
          defaultAt: true,
          role: true,
          organisationId: true,
          organisation: {
            select: {
              name: true,
              id: true,
            },
          },
        },
        orderBy: [
          {
            defaultAt: "asc",
          },
          {
            organisation: {
              name: "asc",
            },
          },
        ],
      },
    },
  });
}

function findUserById(id: string) {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      accounts: {
        select: {
          provider: true,
        },
      },
      userOrganisations: {
        select: {
          defaultAt: true,
          role: true,
          organisationId: true,
          organisation: {
            select: {
              name: true,
              id: true,
            },
          },
        },
        orderBy: [
          {
            defaultAt: "asc",
          },
          {
            organisation: {
              name: "asc",
            },
          },
        ],
      },
    },
  });
}

function updateUser(user: Partial<User>) {
  return prisma.user.update({
    where: {
      id: user.id,
    },
    data: user,
  });
}

export { findUserByEmail, findUserById, updateUser };
