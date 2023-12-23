import { compare, hashSync } from "bcrypt";
import { prisma } from "./prisma";
import { randomUUID } from "crypto";

const saltiness = 12;

function validatePasswordResetToken(token: string) {
  return prisma.passwordResetToken.findUnique({
    where: {
      token,
      createdAt: { gt: new Date(Date.now() - 1000 * 60 * 60 * 4) },
      resetAt: null,
    },
  });
}

function generatePasswordResetToken(userId: string) {
  return prisma.passwordResetToken.create({
    data: {
      userId,
      token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ""),
    },
  });
}

function usePasswordResetToken(id: string) {
  return prisma.passwordResetToken.update({
    data: {
      resetAt: new Date(),
    },
    where: {
      id,
    },
  });
}

function updatePassword(userId: string, password: string) {
  password = hashSync(password, saltiness);
  return prisma.user.update({
    data: {
      password,
    },
    where: {
      id: userId,
    },
  });
}

function createUserByEmailAndPassword(user: {
  email: string;
  password: string;
}) {
  user.password = hashSync(user.password, saltiness);
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

export {
  checkUserCredentials,
  createUserByEmailAndPassword,
  generatePasswordResetToken,
  updatePassword,
  validatePasswordResetToken,
  usePasswordResetToken,
};
