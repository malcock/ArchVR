import "@bogeychan/elysia-polyfills/node/index.js";
import { Elysia } from "elysia";
import { minimatch } from "minimatch";

import { jwtPlugin } from "../jwt";

export class JwtAuthError extends Error {
  constructor(public message: string) {
    super(message);
  }
}

export interface JwtAuthConfig {
  errorMessage?: string;
  exclude?: string[];
  noErrorThrown?: boolean;
}

export const JwtAuth = (config: JwtAuthConfig) =>
  new Elysia({ name: "jwt auth", seed: config })
    .use(jwtPlugin)
    // .error({ JWT_AUTH_ERROR: JwtAuthError })
    // .onError((ctx) => {
    //   if (ctx.code === "JWT_AUTH_ERROR") {
    //     ctx.set.status = 401;
    //     return ctx.error.message;
    //   }
    // })
    .derive(async ({ headers, accessJwt }) => {
      const { authorization } = headers;
      if (!authorization)
        return { auth: { isAuth: false, userId: "", organisationId: "" } };
      const token = authorization.split(" ")[1];
      const details = await accessJwt.verify(token);
      if (details) {
        return {
          auth: {
            isAuth: true,
            userId: details.userId,
            organisationId: details.organisationId,
          },
        };
      }
      return { auth: { isAuth: false, userId: "", organisationId: "" } };
    })
    .onTransform((ctx) => {
      if (
        !ctx.auth.isAuth &&
        !config.noErrorThrown &&
        !isPathExcluded(ctx.path, config.exclude) &&
        ctx.request.method !== "OPTIONS"
      ) {
        throw new JwtAuthError(config.errorMessage ?? "Unauthorized");
      }
    });

export const isPathExcluded = (path: string, excludedPatterns?: string[]) => {
  if (!excludedPatterns) return false;
  for (const pattern of excludedPatterns) {
    if (minimatch(path, pattern)) return true;
  }
  return false;
};

const a = JwtAuth({});

export type JwtAuthed = typeof a;
