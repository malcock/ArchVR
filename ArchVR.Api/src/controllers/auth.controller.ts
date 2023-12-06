import { Elysia, NotFoundError, t, ValidationError } from "elysia";
import userService from "../services/users.services";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import organisationService from "../services/organisation.service";
import { Roles } from "../enums/Roles";
import {
  addRefreshTokenToWhitelist,
  deleteRefreshToken,
  findRefreshTokenById,
  revokeTokens,
} from "../services/auth.services";
import { JwtAuth } from "../middleware/JwtAuth";
import { jwtPlugin } from "../jwt";
import { hashToken } from "../utils/hashToken";
import { HttpException } from "../exceptions/HttpException";

export default (app: Elysia) =>
  app
    .use(jwtPlugin)
    .use(
      JwtAuth({
        exclude: ["/auth/register", "/auth/login", "/auth/refresh-token"],
      })
    )
    .post(
      "/auth/register",
      async ({ body: { email, password }, accessJwt, refreshJwt, set }) => {
        const userExists = await userService.findUserByEmail(email);
        if (userExists) {
          throw new HttpException(403, "User exists");
        }

        //create a new user
        const user = await userService.createUserByEmailAndPassword({
          email,
          password,
        });

        //create an org for them
        const org = await organisationService.create(user.email);

        //set them as owner
        await organisationService.setUserRole(org.id, user.id, Roles.Owner);
        //set this org as the user's default org
        await organisationService.setUserDefaultOrganisation(org.id, user.id);

        const jti = uuidv4();

        const accessToken = await accessJwt.sign({
          userId: user.id,
          organisationId: org.id,
        });
        const refreshToken = await refreshJwt.sign({
          userId: user.id,
          jti,
        });

        // const { accessToken, refreshToken } = generateTokens(user, jti);

        await addRefreshTokenToWhitelist({
          jti,
          refreshToken,
          userId: user.id,
          organisationId: org.id,
        });

        set.status = 201;

        return {
          accessToken,
          refreshToken,
        };
      },
      {
        body: t.Object({
          email: t.String({ format: "email" }),
          password: t.String(),
        }),
        detail: { tags: ["Auth"] },
      }
    )
    .post(
      "/auth/login",
      async ({ body: { email, password }, accessJwt, refreshJwt }) => {
        console.log("/auth/login");
        const existingUser = await userService.findUserByEmail(email);

        if (!existingUser) {
          throw new HttpException(403, "Invalid credentials");
        }

        const validPassword = await bcrypt.compare(
          password,
          existingUser.password
        );
        if (!validPassword) {
          throw new HttpException(403, "Invalid credentials");
        }
        //sort orgs to make sure we get the latest one to be made default
        const organisationId = existingUser.Organisations.sort((a, b) => {
          return a.defaultAt.getTime() > b.defaultAt.getTime() ? -1 : 1;
        })[0].organisationId;
        const jti = uuidv4();
        const accessToken = await accessJwt.sign({
          userId: existingUser.id,
          organisationId,
        });
        const refreshToken = await refreshJwt.sign({
          userId: existingUser.id,
          jti,
        });

        // const { accessToken, refreshToken } = generateTokens(user, jti);

        await addRefreshTokenToWhitelist({
          jti,
          refreshToken,
          userId: existingUser.id,
          organisationId,
        });

        return { accessToken, refreshToken };
      },
      {
        body: t.Object({
          email: t.String({ format: "email" }),
          password: t.String(),
        }),
        detail: { tags: ["Auth"] },
      }
    )
    .post(
      "/auth/profile",
      async ({ auth: { isAuth, userId } }) => {
        if (isAuth) {
          const user = await userService.findUserById(userId);
          if (user) {
            const { password, ...rest } = user;
            return { ...rest };
          }
        }
        throw new NotFoundError("User profile not found");
      },
      {
        detail: {
          tags: ["Auth"],
        },
      }
    )
    .post(
      "/auth/refresh-token",
      async ({ body: { refreshToken }, refreshJwt, accessJwt }) => {
        const payload = await refreshJwt.verify(refreshToken);
        if (payload) {
          const savedRefreshToken = await findRefreshTokenById(
            payload.jti as string
          );
          if (savedRefreshToken && savedRefreshToken.revoked === false) {
            const hashedToken = hashToken(refreshToken);
            if (hashedToken === savedRefreshToken.hashedToken) {
              //it's good!
              const user = await userService.findUserById(payload.userId);
              if (user) {
                const jti = uuidv4();

                const organisationId = savedRefreshToken.organisationId;

                const accessToken = await accessJwt.sign({
                  userId: user.id,
                  organisationId,
                });
                const newRefreshToken = await refreshJwt.sign({
                  userId: user.id,
                  jti,
                });

                // const { accessToken, refreshToken } = generateTokens(user, jti);

                await addRefreshTokenToWhitelist({
                  jti,
                  refreshToken,
                  userId: user.id,
                  organisationId,
                });
                return {
                  accessToken,
                  refreshToken: newRefreshToken,
                };
              }
            }
          }
        }
        throw new HttpException(401, "Unauthorized");
      },
      {
        body: t.Object({
          refreshToken: t.String(),
        }),
        detail: {
          tags: ["Auth"],
        },
      }
    )
    .post(
      "/auth/revoke-tokens",
      async ({ auth: { userId } }) => {
        await revokeTokens(userId);
        return { message: `Tokens revoked for user with id #${userId}` };
      },
      {
        detail: {
          security: [{ bearerAuth: [] }],
          tags: ["Auth"],
        },
      }
    )
    .post(
      "/auth/logout",
      async ({ body: { refreshToken }, refreshJwt }) => {
        const payload = await refreshJwt.verify(refreshToken);
        if (payload) {
          await deleteRefreshToken(payload.jti as string);
          return { loggedOut: true };
        }
      },
      {
        body: t.Object({
          refreshToken: t.String(),
        }),
        detail: {
          security: [{ bearerAuth: [] }],
          tags: ["Auth"],
        },
      }
    )
    .post(
      "/auth/switch-org",
      async ({ body: { organisationId }, auth: { userId } }) => {
        await organisationService.setUserDefaultOrganisation(
          organisationId,
          userId
        );
      },
      {
        body: t.Object({
          organisationId: t.String(),
        }),
        detail: {
          security: [{ bearerAuth: [] }],
          tags: ["Auth"],
        },
      }
    );
