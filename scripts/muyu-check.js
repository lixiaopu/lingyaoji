// 电子木鱼验证：点击木鱼 -> 局部截图 -> 检查浮动文字与控制台错误
import puppeteer from "puppeteer";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });

const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });

await page.goto("http://localhost:8080", { waitUntil: "networkidle0" });

const clip = { x: 980, y: 620, width: 300, height: 280 };

// 点击瞬间：浮动文字 + 敲击动画进行中
await page.click("#muyu");
await sleep(160);
await page.screenshot({ path: "screenshots/muyu-tap.png", clip });

const floatCount = await page.$$eval(".muyu-float", (els) => els.length);
const floatText = await page.$eval(".muyu-float", (el) => el.textContent).catch(() => null);

// 动画结束后：木鱼静置状态
await sleep(2200);
await page.screenshot({ path: "screenshots/muyu-idle.png", clip });

console.log("float texts live:", floatCount, "| text:", floatText);
console.log("errors:", errors.length ? errors : "none");
await browser.close();
