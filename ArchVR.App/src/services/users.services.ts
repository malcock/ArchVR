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
