import { Roles } from "../enums/Roles";
import { Permissions } from "../enums/Permissions";

const RolePermissions: Record<keyof typeof Roles, Permissions[]> = {
  SuperAdmin: [
    Permissions.Admin,
    Permissions.EditBilling,
    Permissions.ViewOrganisation,
    Permissions.EditOrganisation,
    Permissions.EditOrganisationRoles,
    Permissions.EditProject,
    Permissions.EditProjectRoles,
    Permissions.CreateProjects,
    Permissions.ListProjects,
    Permissions.ViewProject,
    Permissions.Comment,
  ],
  Owner: [
    Permissions.EditBilling,
    Permissions.ViewOrganisation,
    Permissions.EditOrganisation,
    Permissions.EditOrganisationRoles,
    Permissions.EditProject,
    Permissions.EditProjectRoles,
    Permissions.ListProjects,
    Permissions.ViewProject,
    Permissions.Comment,
    Permissions.CreateProjects,
  ],
  Admin: [
    Permissions.ViewOrganisation,
    Permissions.EditOrganisation,
    Permissions.EditOrganisationRoles,
    Permissions.EditProject,
    Permissions.EditProjectRoles,
    Permissions.ListProjects,
    Permissions.ViewProject,
    Permissions.Comment,
    Permissions.CreateProjects,
  ],
  Editor: [
    Permissions.ViewOrganisation,
    Permissions.EditProject,
    Permissions.EditProjectRoles,
    Permissions.ListProjects,
    Permissions.ViewProject,
    Permissions.Comment,
    Permissions.CreateProjects,
  ],
  Viewer: [
    Permissions.ListProjects,
    Permissions.ViewProject,
    Permissions.Comment,
  ],
};

export default RolePermissions;
