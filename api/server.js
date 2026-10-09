
import express from "express";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { buildGreeting } from "../src/greeting.js";

const app = express();

app.get("/api/health", (request, response) => {
  response.status(200).json({
    status: "ok",
    message: "API funcionando!",
  });
});

app.get("/api/hello", (request, response) => {
  const name = request.query.name ?? "mundo";

  response.status(200).json({
    greeting: buildGreeting(name),
  });
});

app.get("/", async (request, response, next) => {
  try {
    const html = await readFile("public/index.html", "utf8");
    response.type("html").send(html);
  } catch (error) {
    next(error);
  }
});

app.get("/build-info.json", async (request, response, next) => {
  try {
    const info = await readFile("public/build-info.json", "utf8");
    response.type("json").send(info);
  } catch (error) {
    next(error);
  }
});

const server = createServer(app);
const port = Number(process.env.PORT) || 3000;

server.listen(port, "127.0.0.1", () => {
  console.log(`Servidor rodando em http://127.0.0.1:${port}`);
});
