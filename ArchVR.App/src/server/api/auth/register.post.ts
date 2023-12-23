import { z } from "zod";
import { createUserByEmailAndPassword } from "~/services/auth.services";
import { findUserByEmail } from "~/services/users.services";
import { H3Error } from "h3";
import { registerSchema } from "~/schemas/auth";

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, registerSchema.parse);

    // const body = await readBody<{ email: string; password: string }>(event);
    console.log({ body });

    console.log("checking for user");

    const userExists = await findUserByEmail(body.email);
    console.log({ userExists });
    if (userExists) {
      throw createError({
        statusCode: 403,
        statusMessage: "User already exists",
      });
    }
    console.log(body.email);

    await createUserByEmailAndPassword(body);

    setResponseStatus(event, 201);

    return { message: "User created" };
  } catch (err) {
    if (err instanceof H3Error) {
      throw err;
    }
    console.log(err);
    throw createError({
      statusCode: 500,
      statusMessage: "An unknow error occurred",
    });
  }
});
