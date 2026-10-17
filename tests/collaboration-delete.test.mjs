import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

test("Partner deletion sends DELETE with bearer token and preserves API result", async () => {
  const calls = [];
  const response = { data: { status: { code: 200 }, response: "Deleted" } };
  const source = readFileSync(new URL("../src/app/services/CollaborationService.jsx", import.meta.url), "utf8")
    .replace(/^import .*;\r?\n/gm, "")
    .replace("export default", "module.exports =");
  const module = { exports: {} };
  vm.runInNewContext(source, {
    module,
    Cookies: { get(name) { assert.equal(name, "Authorization"); return "test-token"; } },
    createAxiosInstance: () => ({
      delete(...args) { calls.push(args); return Promise.resolve(response); },
    }),
  });
  assert.equal(await module.exports.deleteLogo(17), response);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].length, 2);
  assert.equal(calls[0][0], "admin/delete/collaboration/17");
  assert.equal(calls[0][1].headers.Authorization, "Bearer test-token");
  assert.equal(calls[0][1].headers["Content-Type"], undefined);
});
