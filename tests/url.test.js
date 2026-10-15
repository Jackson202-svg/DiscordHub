import test from "node:test";
import assert from "node:assert/strict";
import { safeExternalUrl } from "../src/utils/url.js";

test("accepts HTTPS URLs", () => {
  assert.equal(safeExternalUrl("https://github.com/example/repo"), "https://github.com/example/repo");
});
test("rejects javascript URLs", () => {
  assert.equal(safeExternalUrl("javascript:alert(1)"), null);
});
test("rejects URLs containing credentials", () => {
  assert.equal(safeExternalUrl("https://user:pass@example.com"), null);
});
test("rejects invalid and oversized URLs", () => {
  assert.equal(safeExternalUrl("not a URL"), null);
  assert.equal(safeExternalUrl("https://example.com/" + "x".repeat(2100)), null);
});
