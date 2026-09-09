// permissions.js
// Central RBAC configuration: roles map to a list of permission strings.
// Keeping this in one place means adding a new role or tweaking access
// never requires touching component code — only this file.

export const ROLES = {
  ADMIN: "Admin",
  EDITOR: "Editor",
  VIEWER: "Viewer",
};

// Permission naming convention: "<resource>:<action>"
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    "dashboard:view",
    "posts:view",
    "posts:create",
    "posts:edit",
    "posts:delete",
    "users:view",
    "users:manage",
    "settings:manage",
  ],
  [ROLES.EDITOR]: [
    "dashboard:view",
    "posts:view",
    "posts:create",
    "posts:edit",
  ],
  [ROLES.VIEWER]: ["dashboard:view", "posts:view"],
};

// Returns true if the given role has the given permission.
export const roleHasPermission = (role, permission) => {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
};

// Returns true if the role has ALL of the given permissions.
export const roleHasAllPermissions = (role, permissions = []) =>
  permissions.every((p) => roleHasPermission(role, p));

// Returns true if the role has ANY of the given permissions.
export const roleHasAnyPermission = (role, permissions = []) =>
  permissions.some((p) => roleHasPermission(role, p));
