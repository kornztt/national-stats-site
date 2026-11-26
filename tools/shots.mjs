// 给数观中国拍 4 张真实渲染截图：总览、经济、地区对比（1280x720），手机总览（390x844）。
// 用 headed Firefox + Xvfb（见 ~/workspace/makefun-fps/SCREENSHOTS.md）。
// 用法：xvfb-run -a -s "-screen 0 1280x720x24" node tools/shots.mjs
import { firefox } from "/home/hatch/workspace/pw-test/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";

const BASE = "http://127.0.0.1:8123/index.html";
const OUT = new URL("../screenshots/", import.meta.url).pathname;

const browser = await firefox.launch({
  headless: false,
  firefoxUserPrefs: {
    "webgl.force-enabled": true,
    "webgl.software-webgl": true,
    "gfx.webrender.software": true,
  },
  env: {
    ...process.env,
    LIBGL_ALWAYS_SOFTWARE: "1",
    GALLIUM_DRIVER: "llvmpipe",
    MOZ_DISABLE_CONTENT_SANDBOX: "1",
  },
});

const errors = [];
async function shoot(name, hash, width, height, prep) {
  const page = await browser.newPage({ viewport: { width, height } });
  page.on("console", (m) => { if (m.type() === "error") errors.push(name + ": " + m.text()); });
  page.on("pageerror", (e) => errors.push(name + ": " + e.message));
  await page.goto(BASE + hash, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  if (prep) await prep(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  const buf = await page.screenshot({ path: OUT + name, type: "png" });
  console.log(name, buf.length, "bytes");
  await page.close();
}

try {
  await shoot("01-cover.png", "#/", 1280, 720);
  await shoot("02-economy.png", "#/economy", 1280, 720, async (page) => {
    await page.click("#gdp-type button[data-type='bar']");
  });
  await shoot("03-regions.png", "#/regions", 1280, 720, async (page) => {
    await page.fill("#prov-search", "江");
  });
  await shoot("04-mobile.png", "#/", 390, 844);
} finally {
  await browser.close();
}
console.log(errors.length ? "CONSOLE ERRORS:\n" + errors.join("\n") : "no console errors");
