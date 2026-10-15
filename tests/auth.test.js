import test from "node:test";
import assert from "node:assert/strict";
import {normalizeEmail,validatePassword,hashPassword,verifyPassword,hashSessionToken,readCookie,sessionCookie,clearSessionCookie} from "../server/auth.js";
test("normalizes email and rejects invalid values",()=>{assert.equal(normalizeEmail(" User@Example.com "),"user@example.com");assert.equal(normalizeEmail("bad"),null);});
test("validates password length",()=>{assert.equal(validatePassword("short"),false);assert.equal(validatePassword("long-enough-password"),true);assert.equal(validatePassword("x".repeat(129)),false);});
test("scrypt hashes verify only the right password",async()=>{const h=await hashPassword("long-enough-password");assert.match(h,/^scrypt\$16384\$/);assert.equal(await verifyPassword("long-enough-password",h),true);assert.equal(await verifyPassword("wrong-password",h),false);});
test("session tokens are hashed",()=>{assert.notEqual(hashSessionToken("raw"),"raw");assert.equal(hashSessionToken("raw"),hashSessionToken("raw"));});
test("cookie helpers set and clear HttpOnly sessions",()=>{assert.equal(readCookie("theme=dark; discordhub_session=abc"),"abc");assert.match(sessionCookie("abc",false),/HttpOnly; SameSite=Lax/);assert.match(clearSessionCookie(false),/Max-Age=0/);});
