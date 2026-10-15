import test from "node:test";
import assert from "node:assert/strict";
import { validateSearchQuery, validateInviteCode } from "../src/utils/validation.js";
test("search query trims surrounding whitespace",()=>assert.equal(validateSearchQuery("  open source  "),"open source"));
test("search query rejects short input",()=>assert.throws(()=>validateSearchQuery("x"),{statusCode:400}));
test("search query rejects oversized input",()=>assert.throws(()=>validateSearchQuery("a".repeat(121)),{statusCode:400}));
test("invite code accepts alphanumeric and hyphen",()=>assert.equal(validateInviteCode("abc-123"),"abc-123"));
test("invite code rejects URL fragments",()=>assert.throws(()=>validateInviteCode("abc/../../"),{statusCode:400}));
