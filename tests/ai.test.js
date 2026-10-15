import test from "node:test";
import assert from "node:assert/strict";
import { config } from "../server/config.js";
import { summarizeDiscovery } from "../server/ai.js";
const configured=Boolean(config.aiApiUrl&&config.aiApiKey&&config.aiModel);
test("AI helper reports missing provider configuration safely",{skip:configured?"AI provider is configured in this environment":false},async()=>{
 await assert.rejects(summarizeDiscovery({title:"Example",description:"Example",url:"https://example.com"}),e=>e.statusCode===503&&/AI summaries need/.test(e.publicMessage));
});
