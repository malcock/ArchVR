import { PrismaClient } from "@prisma/client";
import { envConfig } from "~/envConfig";

import chalk from "chalk";

const prismaLogger = (...args: any[]) => {
  // eslint-disable-next-line no-console
  console.log(chalk.magenta("[PRISMA]"), " - ", ...args);
};

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      envConfig.NODE_ENV === "development"
        ? [
            { emit: "event", level: "info" },
            { emit: "event", level: "error" },
            { emit: "event", level: "warn" },
            { emit: "event", level: "query" },
          ]
        : ["error"],
  });
// .$extends({
//   query: {
//     $allOperations: async (args) => {
//       const before = Date.now();
//       const result = await args.query;
//       const after = Date.now();
//       prismaLogger(`${args.model}.${args.operation} - ${after - before}ms`);
//       return result;
//     },
//   },
// });

// prisma.$use(async (params, next) => {
//   const before = Date.now();
//   const result = await next(params);
//   const after = Date.now();

//   prismaLogger(`${params.model}.${params.action} - ${after - before}ms`);
//   return result;
// });

// if (envConfig.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prisma;
// }
// import { PrismaClient } from "@prisma/client";
// import { envConfig } from "~/envConfig";

// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// export const prisma =
//   globalForPrisma.prisma ||
//   new PrismaClient({
//     log:
//       envConfig.NODE_ENV === "development"
//         ? ["query", "error", "warn"]
//         : ["error"],
//   });

// if (envConfig.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prisma;
// }
