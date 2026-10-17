// 墨晕调优验证：页面点击有墨晕（~900ms），木鱼点击无墨晕
import puppeteer from "puppeteer";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });

const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });

await page.goto("http://localhost:8080", { waitUntil: "networkidle0" });

// 1) 页面点击：600ms 时墨晕应仍在，1s 后应消散
const clip = { x: 400, y: 480, width: 480, height: 220 };
await page.mouse.click(640, 560);
await sleep(600);
await page.screenshot({ path: "screenshots/ink-mid.png", clip });
await sleep(450);
await page.screenshot({ path: "screenshots/ink-after.png", clip });

// 2) 木鱼点击：不应出现墨晕（但应有浮动文字）
await page.click("#muyu");
await sleep(150);
await page.screenshot({ path: "screenshots/muyu-nosplash.png", clip: { x: 1000, y: 640, width: 280, height: 260 } });

console.log("errors:", errors.length ? errors : "none");
await browser.close();
