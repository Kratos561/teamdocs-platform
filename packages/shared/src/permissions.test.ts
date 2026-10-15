import test from "node:test";
import assert from "node:assert/strict";
import { canEdit, canRead, effectiveRole } from "./permissions.js";

test("sin rol no hay lectura ni escritura", () => {
  assert.equal(canRead(null), false);
  assert.equal(canEdit(null), false);
});

test("viewer lee pero no edita; editor sí", () => {
  assert.equal(canRead("viewer"), true);
  assert.equal(canEdit("viewer"), false);
  assert.equal(canEdit("editor"), true);
});

test("override por documento gana al de workspace", () => {
  assert.equal(effectiveRole("viewer", "editor"), "editor");
  assert.equal(effectiveRole("admin", null), "admin");
});
