import test from "node:test";
import assert from "node:assert/strict";
import {summarizeDiscovery} from "../server/ai.js";
test("AI helper reports missing provider configuration safely",async()=>{await assert.rejects(summarizeDiscovery({title:"Example",description:"Example",url:"https://example.com"}),e=>e.statusCode===503&&/AI summaries need/.test(e.publicMessage));});
