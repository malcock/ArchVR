import { compare, hashSync } from "bcrypt";
import { prisma } from "./prisma";
import { randomUUID } from "crypto";
import { findUserByEmail, findUserById } from "./users.services";

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

async function getUserSession(searchParams: { email?: string; id?: string }) {
  const { email, id } = searchParams;
  let user: Awaited<ReturnType<typeof findUserByEmail>>;
  if (id) {
    user = await findUserById(id);
  } else if (email) {
    user = await findUserByEmail(email);
  } else {
    throw createError({
      statusCode: 400,
      message: "session must search for an id or email",
    });
  }
  if (user) {
    const { userOrganisations, ...others } = user;
    if (userOrganisations.length > 0) {
      const session = {
        ...others,
        organisationId: userOrganisations[0].organisationId,
      };
      return session;
    }
  }
  throw createError({ statusCode: 403, message: "user not found" });
}

export type UserSession = Awaited<ReturnType<typeof getUserSession>>;

export {
  checkUserCredentials,
  createUserByEmailAndPassword,
  generatePasswordResetToken,
  updatePassword,
  validatePasswordResetToken,
  usePasswordResetToken,
  getUserSession,
};
