import { pgTable, text, timestamp, uuid, integer, pgEnum, index, uniqueIndex } from "drizzle-orm/pg-core";

// Roles: owner > admin > editor > viewer. Permiso efectivo = max(workspace, documento).
export const workspaceRoleEnum = pgEnum("workspace_role", ["owner", "admin", "editor", "viewer"]);
export const auditActionEnum = pgEnum("audit_action", [
  "workspace.create",
  "workspace.invite",
  "workspace.role_change",
  "workspace.remove_member",
  "document.create",
  "document.share",
  "document.permission_change",
  "document.revoke",
  "document.restore_version",
  "document.archive"
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  ownerId: uuid("owner_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const workspaceMembers = pgTable(
  "workspace_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    role: workspaceRoleEnum("role").notNull().default("viewer"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (t) => [uniqueIndex("workspace_members_ws_user_uniq").on(t.workspaceId, t.userId)]
);

export const documents = pgTable(
  "documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    title: text("title").notNull().default("Sin título"),
    createdBy: uuid("created_by").references(() => users.id),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (t) => [index("documents_ws_idx").on(t.workspaceId)]
);

// Permiso específico por documento (override cuando sea necesario).
export const documentMembers = pgTable(
  "document_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    documentId: uuid("document_id").notNull().references(() => documents.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    role: workspaceRoleEnum("role").notNull().default("viewer"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (t) => [uniqueIndex("document_members_doc_user_uniq").on(t.documentId, t.userId)]
);

// Estado Yjs persistido (binario). Una fila por documento.
export const documentStates = pgTable("document_states", {
  documentId: uuid("document_id").primaryKey().references(() => documents.id, { onDelete: "cascade" }),
  // bytea via custom? Drizzle no tiene binary nativo portable: usar text base64 en MVP, migrar a bytea después.
  // Guardamos update Yjs como base64 para compatibilidad Neon serverless sin driver nativo.
  yjsStateBase64: text("yjs_state_base64").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const invitations = pgTable(
  "invitations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: workspaceRoleEnum("role").notNull().default("viewer"),
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (t) => [index("invitations_ws_email_idx").on(t.workspaceId, t.email)]
);

// Snapshots explícitos para recuperación (no cada guardado).
export const documentVersions = pgTable(
  "document_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    documentId: uuid("document_id").notNull().references(() => documents.id, { onDelete: "cascade" }),
    createdBy: uuid("created_by").references(() => users.id),
    label: text("label"),
    yjsSnapshotBase64: text("yjs_snapshot_base64").notNull(),
    version: integer("version").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (t) => [index("document_versions_doc_idx").on(t.documentId)]
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorId: uuid("actor_id").references(() => users.id),
    workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }),
    documentId: uuid("document_id").references(() => documents.id, { onDelete: "cascade" }),
    action: auditActionEnum("action").notNull(),
    meta: text("meta"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (t) => [index("audit_logs_ws_idx").on(t.workspaceId), index("audit_logs_doc_idx").on(t.documentId)]
);
