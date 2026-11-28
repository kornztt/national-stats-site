// 给数观中国拍 4 张真实渲染截图：总览、经济、地区对比（1280x720），手机总览（390x844）。
// 用 headed Firefox + Xvfb（见 ~/workspace/makefun-fps/SCREENSHOTS.md）。
// 用法：xvfb-run -a -s "-screen 0 1280x720x24" node tools/shots.mjs
import { firefox } from "/home/hatch/workspace/pw-test/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";

const BASE = "http://127.0.0.1:" + (process.env.NAT_PORT || 8123) + "/index.html";
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
// scrollToEl: 把目标元素顶端放到视口 y=offset 处（顶栏 sticky 高约 56px，offset 要留余量）。
async function scrollToEl(page, selector, offset) {
  await page.evaluate(([sel, off]) => {
    const el = document.querySelector(sel);
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - off);
  }, [selector, offset]);
}
async function shoot(name, hash, width, height, prep, scroll) {
  const page = await browser.newPage({ viewport: { width, height } });
  page.on("console", (m) => { if (m.type() === "error") errors.push(name + ": " + m.text()); });
  page.on("pageerror", (e) => errors.push(name + ": " + e.message));
  await page.goto(BASE + hash, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  if (prep) await prep(page);
  if (scroll) await scroll(page);
  else await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  const buf = await page.screenshot({ path: OUT + name, type: "png" });
  console.log(name, buf.length, "bytes");
  await page.close();
}

try {
  await shoot("01-cover.png", "#/", 1280, 720);
  await shoot("02-economy.png", "#/economy", 1280, 720, async (page) => {
    await page.click("#gdp-type button[data-type='bar']");
  }, async (page) => {
    // 往下滚：柱状图下半截 + 注释行留在画面上方，再把产业环形图与分季度图/表两张卡都拍进来，不留白。
    await scrollToEl(page, "#view .grid-2", 200);
  });
  await shoot("03-regions.png", "#/regions", 1280, 720, async (page) => {
    await page.fill("#prov-search", "江");
  }, async (page) => {
    // 往下滚到省表卡片：搜索框 + 全部两行省表 + 注释行进画面，下方区域卡片也露出来。
    await page.evaluate(() => {
      const cards = document.querySelectorAll("#view > .card");
      const el = cards[1];
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 70);
    });
  });
  await shoot("04-mobile.png", "#/", 390, 844);
} finally {
  await browser.close();
}
console.log(errors.length ? "CONSOLE ERRORS:\n" + errors.join("\n") : "no console errors");
