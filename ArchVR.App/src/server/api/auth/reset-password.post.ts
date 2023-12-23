import {
  updatePassword,
  usePasswordResetToken,
  validatePasswordResetToken,
} from "~/services/auth.services";
import { prisma } from "~/services/prisma";

export default defineEventHandler(async (event) => {
  const { confirmPassword, password, token } = await readBody<{
    token: string;
    password: string;
    confirmPassword: string;
  }>(event);

  if (
    !password ||
    typeof password !== "string" ||
    password !== confirmPassword
  ) {
    return {
      error:
        "The passwords did not match. Please try retyping them and submitting again.",
    };
  }
  const passwordResetToken = await validatePasswordResetToken(token);
  if (!passwordResetToken) {
    return {
      error:
        "Invalid token reset request. Please try resetting your password again.",
    };
  }

  try {
    prisma.$transaction([
      updatePassword(passwordResetToken.userId, password),
      usePasswordResetToken(passwordResetToken.id),
    ]);
    return { message: "Password reset successful!" };
  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      statusMessage: `An unexpected error occured. Please try again and if the problem persists, contact support.`,
    });
  }
});
