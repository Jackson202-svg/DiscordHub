import test from "node:test";
import assert from "node:assert/strict";
import { normalizeSearchInput, searchKey, addRecentSearch } from "../src/pages/discovery-state.js";

test("normalizes whitespace and trims search input", () => {
  assert.equal(normalizeSearchInput("  discord   bot  "), "discord bot");
});
test("limits search input to 120 characters", () => {
  assert.equal(normalizeSearchInput("x".repeat(130)).length, 120);
});
test("search keys ignore case and normalized whitespace", () => {
  assert.equal(searchKey("GitHub", "  Open   Source "), "github:open source");
});
test("recent searches deduplicate and move repeated searches to the front", () => {
  const first = addRecentSearch([], "github", "discord bot");
  const second = addRecentSearch(first, "google", "open source");
  const third = addRecentSearch(second, "github", "discord bot");
  assert.equal(third.length, 2);
  assert.equal(third[0].key, "github:discord bot");
});
test("recent search history stays bounded", () => {
  let history = [];
  for (let i = 0; i < 20; i++) history = addRecentSearch(history, "github", "project " + i);
  assert.equal(history.length, 12);
});
