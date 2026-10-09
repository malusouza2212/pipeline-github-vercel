
import { writeFile } from "node:fs/promises";

const buildInfo = {
  name: "pipeline-github-vercel",
  version: "1.0.0",
  generatedAt: new Date().toISOString(),
};

await writeFile(
  "public/build-info.json",
  JSON.stringify(buildInfo, null, 2)
);

console.log("Build concluído com sucesso!");
