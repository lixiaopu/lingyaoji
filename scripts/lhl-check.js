// 老黄历验证：检查 lhl-strip 渲染内容 + 截图
import puppeteer from "puppeteer";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });

const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });

await page.goto("http://localhost:8080", { waitUntil: "networkidle0" });
await page.click('a[data-nav="daily"]');
await sleep(3600);

const lhl = await page.$eval("#lhl-strip", (el) => el.textContent.trim());
console.log("lhl:", lhl);
await page.screenshot({ path: "screenshots/lhl-daily.png", clip: { x: 250, y: 240, width: 780, height: 140 } });

console.log("errors:", errors.length ? errors : "none");
await browser.close();
