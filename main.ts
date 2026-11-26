// 数观中国参赛程序（Node 22，只用标准库）：把本站的 app/ 与 screenshots/
// 原样拷进输出目录，再用随 kit 带来的 make.fun 库写出 dossier.json。
// 输出目录由 MAKEFUN_OUTPUT_DIR 指定，缺省时用 /output。
// 只建目录、不删目录：评分器以只读身份跑这里，删输出目录会直接失败。
import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const siteDir = join(repoRoot, "app");
const shotsDir = join(repoRoot, "screenshots");

function copyTree(from, to) {
  mkdirSync(to, { recursive: true });
  if (existsSync(from)) cpSync(from, to, { recursive: true });
}

copyTree(siteDir, join(targetDir, "app"));
copyTree(shotsDir, join(targetDir, "screenshots"));

writeFileSync(
  join(targetDir, "dossier.json"),
  buildDossier(targetDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
