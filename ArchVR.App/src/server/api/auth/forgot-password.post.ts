import { findUserByEmail } from "~/services/users.services";
import { generatePasswordResetToken } from "~/services/auth.services";
import sg from "@sendgrid/mail";
import { prisma } from "~/services/prisma";
import { randomUUID } from "crypto";
import { envConfig } from "~/envConfig";
export default defineEventHandler(async (event) => {
  const body = await readBody<{ email: string }>(event);

  const user = await findUserByEmail(body.email);

  if (!user) {
    //no email by that address, silently fail?
    return { message: "reset request sent" };
  }
  // check if that user signed up with an oauth account
  if (user.accounts.length) {
    // TODO: handle sending an email saying they signed up with the a provider

    return { message: "reset request sent" };
  }

  const token = await generatePasswordResetToken(user.id);
  const msg = {
    to: user.email as string,
    from: envConfig.AUTH_SENDGRID_SENDER,
    subject: "Your password reset code",
    text: `Hello ${user.name}, someone (hopefully you) requested a password reset for this account. If you did want to reset your password, please click here: ${envConfig.AUTH_ORIGIN}/auth/password-reset/${token.token}

    For security reasons, this link is only valid for four hours.
        
    If you did not request this reset, please ignore this email.`,
  };
  sg.setApiKey(envConfig.AUTH_SENDGRID_API_KEY);
  sg.send(msg).then(
    (res) => {
      return { message: "reset request sent" };
    },
    (error) => {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }

      throw createError({
        statusCode: 500,
        statusMessage: error,
      });
    }
  );
});
