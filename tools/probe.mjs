// 数观中国自测：每个栏目、每个控件实际点一遍；桌面与手机各跑一遍；控制台零报错。
// 用法：xvfb-run -a -s "-screen 0 1280x720x24" node tools/probe.mjs
import { firefox } from "/home/hatch/workspace/pw-test/node_modules/playwright/index.mjs";

const BASE = "http://127.0.0.1:" + (process.env.NAT_PORT || 8123) + "/index.html";
let pass = 0, fail = 0;
function check(name, ok, extra) {
  if (ok) { pass++; console.log("PASS " + name); }
  else { fail++; console.log("FAIL " + name + (extra ? " — " + extra : "")); }
}

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
async function newPage(w, h) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(e.message));
  return page;
}

try {
  const page = await newPage(1280, 720);
  await page.goto(BASE + "#/", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  check("overview renders KPI cards", (await page.locator(".kpi").count()) === 4);
  check("overview has GDP line chart svg", (await page.locator("#view svg").count()) >= 2);
  check("overview shows 134.91", (await page.locator("#view").innerText()).includes("134.91"));
  check("overview shows source note", (await page.locator("#view").innerText()).includes("国家统计局"));

  // nav to every view
  const views = ["economy", "population", "income", "prices", "trade", "regions"];
  for (const v of views) {
    await page.click("#main-nav a[href='#/" + v + "']");
    await page.waitForTimeout(400);
    const txt = await page.locator("#view").innerText();
    check("view " + v + " renders", txt.length > 200);
    check("view " + v + " has h1", (await page.locator("#view h1").count()) === 1);
  }

  // economy controls: range + type toggles change the chart
  await page.click("#main-nav a[href='#/economy']");
  await page.waitForTimeout(400);
  const before = await page.locator("#gdp-chart svg").innerHTML();
  await page.click("#gdp-range button[data-range='5y']");
  await page.waitForTimeout(300);
  const after5y = await page.locator("#gdp-chart svg").innerHTML();
  check("GDP range toggle redraws", before !== after5y);
  await page.click("#gdp-type button[data-type='bar']");
  await page.waitForTimeout(300);
  const asBar = await page.locator("#gdp-chart svg").innerHTML();
  check("GDP type toggle redraws", asBar !== after5y && asBar.includes("<rect"));
  await page.click("#gdp-type button[data-type='line']");
  await page.waitForTimeout(300);
  await page.click("#gdp-range button[data-range='10y']");
  await page.waitForTimeout(300);
  check("GDP back to 10y line", (await page.locator("#gdp-chart svg").innerHTML()).includes("<path"));

  // regions controls: search, region chip, sort
  await page.click("#main-nav a[href='#/regions']");
  await page.waitForTimeout(400);
  await page.fill("#prov-search", "广东");
  await page.waitForTimeout(300);
  let rows = await page.locator("#prov-body tr").count();
  check("search 广东 filters to 1 row", rows === 1);
  await page.fill("#prov-search", "");
  await page.click("#prov-region button[data-region='中部']");
  await page.waitForTimeout(300);
  rows = await page.locator("#prov-body tr").count();
  check("region chip 中部 filters to 3 rows", rows === 3);
  await page.click("#prov-region button[data-region='全部']");
  await page.click(".th-sort[data-key='growth']");
  await page.waitForTimeout(300);
  const firstRow = await page.locator("#prov-body tr:first-child td:nth-child(2)").innerText();
  check("sort by growth desc puts 江苏/湖北 first", firstRow === "江苏" || firstRow === "湖北");
  await page.click(".th-sort[data-key='growth']");
  await page.waitForTimeout(300);
  const firstRowAsc = await page.locator("#prov-body tr:first-child td:nth-child(2)").innerText();
  check("sort toggles ascending puts 广东 first", firstRowAsc === "广东");

  // no external requests
  const reqs = [];
  page.on("request", (r) => reqs.push(r.url()));
  await page.goto(BASE + "#/trade", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  check("no external requests", reqs.every((u) => u.startsWith(BASE.replace("/index.html", "/"))), reqs.filter((u) => !u.startsWith(BASE.replace("/index.html", "/"))).slice(0, 3).join(", "));
  await page.close();

  // phone viewport
  const mob = await newPage(390, 844);
  await mob.goto(BASE + "#/", { waitUntil: "networkidle" });
  await mob.waitForTimeout(800);
  const overflow = await mob.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check("mobile 390px no horizontal overflow", overflow <= 0, "overflow=" + overflow);
  await mob.click("#main-nav a[href='#/regions']");
  await mob.waitForTimeout(400);
  const mobOverflow = await mob.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check("mobile regions no horizontal overflow", mobOverflow <= 0, "overflow=" + mobOverflow);
  await mob.close();

  check("zero console errors", errors.length === 0, errors.join(" | ").slice(0, 300));
} finally {
  await browser.close();
}
console.log("\nprobe: " + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
