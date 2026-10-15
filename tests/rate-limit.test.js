import test from "node:test";
import assert from "node:assert/strict";
import { createRateLimiter } from "../server/rate-limit.js";

test("allows requests up to the configured limit", () => {
  let time = 1000;
  const check = createRateLimiter({ windowMs: 1000, max: 2, now: () => time });
  assert.equal(check("client-a").allowed, true);
  assert.equal(check("client-a").remaining, 0);
  assert.equal(check("client-a").allowed, false);
});
test("tracks clients separately", () => {
  const check = createRateLimiter({ max: 1 });
  assert.equal(check("client-a").allowed, true);
  assert.equal(check("client-b").allowed, true);
  assert.equal(check("client-a").allowed, false);
});
test("resets a client's counter after the window", () => {
  let time = 1000;
  const check = createRateLimiter({ windowMs: 100, max: 1, now: () => time });
  check("client-a");
  assert.equal(check("client-a").allowed, false);
  time = 1101;
  assert.equal(check("client-a").allowed, true);
});
