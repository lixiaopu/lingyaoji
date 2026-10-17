// 多源数据接入验证：降级渲染 + 免费 API（一言/今日诗词无需 Key）实测
import puppeteer from "puppeteer";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });

const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });

await page.goto("http://localhost:8080", { waitUntil: "networkidle0" });
await sleep(3600); // 等外部 API 超时/升级完成

const poem = await page.$eval("#hero-poem", (el) => el.textContent.trim());
console.log("hero poem:", poem.slice(0, 60));

// 每日运势：黄历条 + 栏目寄语
await page.click('a[data-nav="daily"]');
await sleep(3700);
const lhl = await page.$eval("#lhl-strip", (el) => el.textContent.trim());
const quote = await page.$eval("#daily-quote", (el) => el.textContent.trim());
console.log("lhl:", lhl.slice(0, 80));
console.log("daily quote:", quote.slice(0, 60));
await page.screenshot({ path: "screenshots/api-daily.png" });

// 灵签：摇签 -> 寄语
await page.click('a[data-nav="home"]');
await sleep(400);
await page.click('.portal-item[data-open="lingqian"]');
await page.waitForSelector("#modal-overlay.open");
await page.click("#draw-lingqian");
await sleep(5000); // 1400ms 摇签 + 最久 3s 一言超时
const qianQuote = await page.$eval(".qian-quote", (el) => el.textContent.trim()).catch(() => "(none)");
console.log("qian quote:", qianQuote.slice(0, 60));
await page.screenshot({ path: "screenshots/api-lingqian.png" });
await page.click("#modal-close");
await sleep(300);

// 星座：翻开一张卡 -> 实时指数
await page.click('a[data-nav="astro"]');
await sleep(800);
const card = await page.$("#astro-grid .flip-card");
await card.evaluate((c) => { c.scrollIntoView({ block: "center" }); c.dispatchEvent(new PointerEvent("pointerenter")); c.click(); });
await sleep(3800);
const live = await page.$eval("#astro-grid .flip-card .live-fortune", (el) => el.textContent.trim()).catch(() => "(none)");
console.log("astro live fortune:", live.slice(0, 80));
await page.screenshot({ path: "screenshots/api-astro.png" });

console.log("errors:", errors.length ? errors : "none");
await browser.close();
