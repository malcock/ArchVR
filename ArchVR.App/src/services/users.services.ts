import bcrypt, { compare } from "bcrypt";
import { prisma } from "./prisma";
import { type User } from "@prisma/client";

function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

function findUserById(id: string) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

function createUserByEmailAndPassword(user: {
  email: string;
  password: string;
}) {
  user.password = bcrypt.hashSync(user.password, 12);
  return prisma.user.create({
    data: user,
  });
}

async function checkUserCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user)
    throw createError({
      statusCode: 403,
      statusMessage: "Credentials not working",
    });
  const isPasswordValid = await compare(password, user.password as string);
  if (!isPasswordValid) {
    throw createError({
      statusCode: 403,
      statusMessage: "Credentials not working",
    });
  }
  return user;
}

function updateUser(user: Partial<User>) {
  return prisma.user.update({
    where: {
      id: user.id,
    },
    data: user,
  });
}

export {
  checkUserCredentials,
  createUserByEmailAndPassword,
  findUserByEmail,
  findUserById,
  updateUser,
};
