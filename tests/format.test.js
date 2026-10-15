import test from "node:test";
import assert from "node:assert/strict";
import { formatCompactNumber, formatDate, safeHttpUrl } from "../src/utils/format.js";
test("formats compact counts", () => assert.equal(formatCompactNumber(1200), "1.2K"));
test("returns a fallback for invalid dates", () => assert.equal(formatDate("not-a-date"), "Unknown"));
test("formats ISO dates in UTC", () => assert.equal(formatDate("2025-01-02T00:00:00Z"), "Jan 2, 2025"));
test("allows HTTPS URLs", () => assert.equal(safeHttpUrl("https://example.com"), "https://example.com/"));
test("rejects javascript URLs", () => assert.equal(safeHttpUrl("javascript:alert(1)"), null));
