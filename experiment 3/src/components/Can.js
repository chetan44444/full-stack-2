import { useAuth } from "../context/AuthContext";

/**
 * Declarative permission gate for UI elements (buttons, menu items, etc).
 *
 * Usage:
 *   <Can permission="posts:delete"><button>Delete</button></Can>
 *   <Can permissions={["posts:edit", "posts:delete"]} any><button>...</button></Can>
 *   <Can role="Admin"><AdminOnlyWidget /></Can>
 *   <Can role="Admin" fallback={<p>Ask an admin</p>}>...</Can>
 *
 * Renders nothing (or `fallback`) if the current user's role doesn't
 * satisfy the requirement.
 */
export default function Can({
  permission,
  permissions,
  role,
  any = false,
  fallback = null,
  children,
}) {
  const { can, canAll, canAny, hasRole } = useAuth();

  let allowed = true;

  if (permission) {
    allowed = allowed && can(permission);
  }

  if (permissions && permissions.length > 0) {
    allowed = allowed && (any ? canAny(permissions) : canAll(permissions));
  }

  if (role) {
    allowed = allowed && hasRole(role);
  }

  return allowed ? children : fallback;
}
