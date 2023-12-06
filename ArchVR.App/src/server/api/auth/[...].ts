import GithubProvider from "next-auth/providers/github";
// import Auth0Provider from "next-auth/providers/auth0";
import CredentialsProvider from "next-auth/providers/credentials";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NuxtAuthHandler } from "#auth";
import { envConfig } from "~/envConfig";
import { prisma } from "~/server/prisma";
import { compare } from "bcrypt";

export default NuxtAuthHandler({
  pages: {
    signIn: "/login",
  },
  adapter: PrismaAdapter(prisma),
  secret: envConfig.AUTH_NUXT_SECRET, // secret needed to run nuxt-auth in production mode (used to encrypt data)
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GithubProvider.default({
      // https://github.com/settings/developers
      clientId: envConfig.AUTH_GITHUB_CLIENT_ID,
      clientSecret: envConfig.AUTH_GITHUB_CLIENT_SECRET,
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
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (!user) {
          throw createError({
            statusCode: 403,
            statusMessage: "Credentials not working",
          });
        }

        const isPasswordValid = await compare(
          credentials?.password,
          user.password as string
        );

        if (!isPasswordValid) {
          throw createError({
            statusCode: 403,
            statusMessage: "Credentials not working",
          });
        }
        console.log("password valid");
        console.log({ user });
        return user;
      },
    }),
  ],
  callbacks: {
    // Specify here the payload of your token and session
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      return session;
    },
  },
  session: { strategy: "jwt" },
});
