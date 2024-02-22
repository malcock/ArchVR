import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "staging", "production"])
    .default("development"),
  DATABASE_URL: z.string().nonempty(),
  AUTH_NUXT_SECRET: z.string().nonempty().min(16),
  AUTH_ORIGIN: z.string().url().default("http://localhost:3000"),
  AUTH_AUTH0_CLIENT_ID: z.string().optional(),
  AUTH_AUTH0_CLIENT_SECRET: z.string().optional(),
  AUTH_AUTH0_ISSUER: z.string().url().optional(),
  AUTH_GITHUB_CLIENT_ID: z.string().optional(),
  AUTH_GITHUB_CLIENT_SECRET: z.string().optional(),
  AUTH_SENDGRID_SENDER: z.string().email(),
  AUTH_SENDGRID_API_KEY: z.string(),
  AZURE_STORAGE_CONNECTION_STRING: z.string(),
});

const parsedSchema = envSchema.safeParse(process.env);

if (parsedSchema.success === false) {
  console.error(
    "😔 Your env is invalid!",
    parsedSchema.error.flatten().fieldErrors
  );
  throw new Error("😔 Your env is invalid!");
}

export const envConfig = parsedSchema.data;
