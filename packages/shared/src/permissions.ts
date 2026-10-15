export type WorkspaceRole = "owner" | "admin" | "editor" | "viewer";

const RANK: Record<WorkspaceRole, number> = { viewer: 0, editor: 1, admin: 2, owner: 3 };

export function maxRole(a: WorkspaceRole, b: WorkspaceRole): WorkspaceRole {
  return RANK[a] >= RANK[b] ? a : b;
}

export function canRead(role: WorkspaceRole | null): boolean {
  return role !== null;
}

export function canEdit(role: WorkspaceRole | null): boolean {
  return role !== null && RANK[role] >= RANK.editor;
}

export function canManage(role: WorkspaceRole | null): boolean {
  return role !== null && RANK[role] >= RANK.admin;
}

// Permiso efectivo: override por documento si existe, si no el de workspace.
// Nunca confiar solo en frontend: el backend y el WS deben llamar a esto.
export function effectiveRole(
  workspaceRole: WorkspaceRole | null,
  documentRole: WorkspaceRole | null | undefined
): WorkspaceRole | null {
  if (documentRole) return documentRole;
  return workspaceRole;
}

export function roomForDocument(documentId: string): string {
  return `doc:${documentId}`;
}
