import GithubProvider from "next-auth/providers/github";
// import Auth0Provider from "next-auth/providers/auth0";
import CredentialsProvider from "next-auth/providers/credentials";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NuxtAuthHandler } from "#auth";
import { envConfig } from "~/envConfig";
import { prisma } from "~/services/prisma";

import { findUserByEmail, findUserById } from "~/services/users.services";

import { checkUserCredentials, getUserSession } from "~/services/auth.services";
import organisationService from "~/services/organisation.service";
("~/services/organisation.service");
import { Roles } from "~/enums/Roles";

export default NuxtAuthHandler({
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/welcome",
  },
  adapter: PrismaAdapter(prisma),
  secret: envConfig.AUTH_NUXT_SECRET, // secret needed to run nuxt-auth in production mode (used to encrypt data)
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GithubProvider.default({
      // https://github.com/settings/developers
      clientId: envConfig.AUTH_GITHUB_CLIENT_ID,
      clientSecret: envConfig.AUTH_GITHUB_CLIENT_SECRET,
      // GitHub now returns an `iss` param on the callback, which next-auth 4.21 rejects unless the issuer is set
      issuer: "https://github.com/login/oauth",
    }),

    // // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    // Auth0Provider.default({
    //   // https://manage.auth0.com/dashboard
    //   clientId: envConfig.AUTH_AUTH0_CLIENT_ID,
    //   clientSecret: envConfig.AUTH_AUTH0_CLIENT_SECRET,
    //   issuer: envConfig.AUTH_AUTH0_ISSUER
    // })
    // @ts-expect-error  You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "(hint: hello@razor.co.uk)",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "(hint: hunter2)",
        },
      },
      async authorize(credentials: any) {
        return checkUserCredentials(credentials.email, credentials.password);
      },
    }),
  ],
  callbacks: {
    // Specify here the payload of your token and session
    jwt: async ({ token, trigger, user, profile, account, session }) => {
      // console.log({ token, t rigger, user, profile, account, session });
      if (trigger === "signIn") {
        token.user =
          user || (await getUserSession({ email: token.email as string }));
      } else if (trigger === "signUp") {
        token.user = user;
        const org = await organisationService.create(user.email as string);
        await organisationService.setUserRole(org.id, user.id, Roles.Owner);
        await organisationService.setUserDefaultOrganisation(org.id, user.id);
        console.log("jwt signup", { user });
        token.user = await getUserSession({ id: user.id });
      } else {
        token.user = await getUserSession({ id: (token.user as any).id });
      }
      if (!token.user) {
        return Promise.reject(token);
      }

      return Promise.resolve(token);
    },
    session: async ({ session, token }) => {
      //@ts-ignore
      session.user = token.user;
      // console.log({ session, token });
      return Promise.resolve(session);
    },
  },
  session: { strategy: "jwt" },
});
