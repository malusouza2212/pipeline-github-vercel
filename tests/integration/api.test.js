
import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";

const port = 3001;
const baseUrl = `http://127.0.0.1:${port}`;

let server;

test.before(async () => {
  server = spawn(
    process.execPath,
    ["api/server.js"],
    {
      env: { ...process.env, PORT: String(port) },
      stdio: "ignore",
    }
  );

  let ready = false;

  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);

      if (response.ok) {
        ready = true;
        break;
      }
    } catch {
      // O servidor ainda pode estar iniciando.
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  if (!ready) {
    server.kill();
    throw new Error("O servidor de teste não iniciou.");
  }
});

test.after(() => {
  server?.kill();
});

test("GET /api/health deve retornar status ok", async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  const data = await response.json();

  assert.equal(response.status, 200);
  assert.equal(data.status, "ok");
});

test("GET /api/hello deve cumprimentar pelo nome", async () => {
  const response = await fetch(`${baseUrl}/api/hello?name=Maria`);
  const data = await response.json();

  assert.equal(response.status, 200);
  assert.equal(data.greeting, "Olá, Maria!");
});

test("GET /api/hello deve usar mundo sem nome", async () => {
  const response = await fetch(`${baseUrl}/api/hello`);
  const data = await response.json();

  assert.equal(data.greeting, "Olá, mundo!");
});

test("GET / deve entregar o site", async () => {
  const response = await fetch(baseUrl);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Pipeline CI\/CD/);
});
