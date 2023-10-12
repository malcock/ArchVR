import { PrismaClient } from "@prisma/client";
import { Permissions } from "../src/enums/Permissions";
import { Roles } from "../src/enums/Roles";

const prisma = new PrismaClient();

const rolePermissions: Record<keyof typeof Roles, Permissions[]> = {
  SuperAdmin: [
    Permissions.Admin,
    Permissions.EditBilling,
    Permissions.EditOrganisation,
    Permissions.EditOrganisationRoles,
    Permissions.EditProject,
    Permissions.EditProjectRoles,
    Permissions.ListProjects,
    Permissions.ViewProject,
    Permissions.Comment,
  ],
  Owner: [
    Permissions.EditBilling,
    Permissions.EditOrganisation,
    Permissions.EditOrganisationRoles,
    Permissions.EditProject,
    Permissions.EditProjectRoles,
    Permissions.ListProjects,
    Permissions.ViewProject,
    Permissions.Comment,
  ],
  Admin: [
    Permissions.EditOrganisation,
    Permissions.EditOrganisationRoles,
    Permissions.EditProject,
    Permissions.EditProjectRoles,
    Permissions.ListProjects,
    Permissions.ViewProject,
    Permissions.Comment,
  ],
  Editor: [
    Permissions.EditProject,
    Permissions.EditProjectRoles,
    Permissions.ListProjects,
    Permissions.ViewProject,
    Permissions.Comment,
  ],
  Viewer: [
    Permissions.ListProjects,
    Permissions.ViewProject,
    Permissions.Comment,
  ],
};

function resolveObject(obj: any) {
  return Promise.all(
    Object.entries(obj).map(async ([k, v]) => [k, await v])
  ).then(Object.fromEntries);
}
console.log("eh");
async function main() {
  //add admin user(s)
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error(
      `missing admin email or password '${process.env.ADMIN_EMAIL}' '${process.env.ADMIN_PASSWORD}`
    );
  }
  await prisma.user.upsert({
    where: {
      email: process.env.ADMIN_EMAIL as string,
    },
    create: {
      email: process.env.ADMIN_EMAIL as string,
      password: process.env.ADMIN_PASSWORD as string,
      isAdmin: true,
    },
    update: {},
  });

  // //add
  // let perms: Partial<Record<keyof typeof Permissions, any>> = {};

  // (Object.keys(Permissions) as Array<keyof typeof Permissions>).forEach((x) => {
  //   perms[x] = prisma.permission.upsert({
  //     where: {
  //       name: x,
  //     },
  //     update: {},
  //     create: {
  //       name: x,
  //     },
  //   });
  // });

  // // add our permissions
  // await resolveObject(perms).then(
  //   async (res: Record<keyof typeof Permissions, Permission>) => {
  //     //add roles
  //     let rolesPerms: Partial<Record<keyof typeof Roles, any>> = {};
  //     (Object.keys(Roles) as Array<keyof typeof Roles>).forEach((x) => {
  //       rolesPerms[x] = prisma.role.upsert({
  //         where: {
  //           name: x,
  //         },
  //         update: {},
  //         create: {
  //           name: x,
  //           Permissions: {
  //             create: rolePermissions[x].map((y) => ({
  //               permissionId: res[y].id,
  //             })),
  //           },
  //         },
  //       });
  //     });

  //     await resolveObject(rolesPerms);
  //     return res;
  //   }
  // );

  // console.log({ perms });
}

main()
  .then(async () => {
    console.log("done");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
