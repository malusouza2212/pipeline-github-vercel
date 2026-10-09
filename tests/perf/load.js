
import autocannon from "autocannon";
import { spawn } from "node:child_process";

const url = "http://127.0.0.1:3000/api/health";

let server;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer() {
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return;
      }
    } catch {
      // O servidor ainda pode estar iniciando.
    }

    await wait(500);
  }

  throw new Error("O servidor não respondeu a tempo.");
}

try {
  console.log("Iniciando servidor para o teste de performance...");

  server = spawn(
    process.execPath,
    ["api/server.js"],
    {
      stdio: "inherit",
      env: {
        ...process.env,
        PORT: "3000",
      },
    }
  );

  server.on("error", (error) => {
    console.error("Erro ao iniciar o servidor:", error.message);
  });

  await waitForServer();

  console.log("Servidor pronto. Iniciando teste de performance...");

  const result = await autocannon({
    url,
    connections: 10,
    duration: 5,
    pipelining: 1,
  });

  console.log("\n--- Resultado do teste de performance ---");
  console.log(`Requisições por segundo: ${result.requests.average}`);
  console.log(`Latência p99: ${result.latency.p99} ms`);
  console.log(`Erros: ${result.errors}`);
  console.log(`Timeouts: ${result.timeouts}`);

  const failed =
    result.latency.p99 > 100 ||
    result.requests.average < 500 ||
    result.errors > 0 ||
    result.timeouts > 0;

  if (failed) {
    console.error("Teste de performance reprovado.");
    process.exitCode = 1;
  } else {
    console.log("Teste de performance aprovado!");
  }
} catch (error) {
  console.error("Erro ao executar o teste:", error.message);
  process.exitCode = 1;
} finally {
  if (server && server.exitCode === null && !server.killed) {
    server.kill();
    await Promise.race([
      new Promise((resolve) => server.once("exit", resolve)),
      wait(3000),
    ]);
  }
}
