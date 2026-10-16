// 灵爻集 · 自动化冒烟测试
// 使用 Puppeteer 抓取页面与弹窗截图，验证主要交互可正常运行

import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

const base = "http://localhost:8080";
const outDir = path.resolve(process.cwd(), "screenshots");

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  headless: "new",
  defaultViewport: { width: 1280, height: 900 },
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const page = await browser.newPage();

const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(err.message));

try {
  await page.goto(base, { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(outDir, "01-home.png") });
  console.log("✓ 首页已截图");

  // 今日灵签：打开 -> 摇签 -> 截图
  await page.click('.portal-item[data-open="lingqian"]');
  await page.waitForSelector("#modal-overlay.open", { timeout: 5000 });
  await sleep(300);
  await page.screenshot({ path: path.join(outDir, "02-lingqian-open.png") });
  await page.click("#draw-lingqian");
  await sleep(1700);
  await page.screenshot({ path: path.join(outDir, "03-lingqian-result.png") });
  await page.click("#modal-close");
  await sleep(300);

  // 五行测试：打开 -> 答题 -> 提交 -> 截图
  await page.click('.portal-item[data-open="wuxing"]');
  await page.waitForSelector("#modal-overlay.open", { timeout: 5000 });
  await sleep(300);
  await page.screenshot({ path: path.join(outDir, "04-wuxing-open.png") });
  const questions = await page.$$(".quiz-options");
  for (const q of questions) {
    await q.click('input[type="radio"]:nth-of-type(2)');
  }
  await page.click("#wuxing-form button[type=submit]");
  await sleep(400);
  await page.screenshot({ path: path.join(outDir, "05-wuxing-result.png") });
  await page.click("#modal-close");
  await sleep(300);

  // 守护生肖：输入年份 -> 生成 -> 截图
  await page.click('.portal-item[data-open="shengxiao"]');
  await page.waitForSelector("#modal-overlay.open", { timeout: 5000 });
  await sleep(300);
  await page.type("#guardian-year", "1995");
  await page.click("#generate-by-year");
  await sleep(400);
  await page.screenshot({ path: path.join(outDir, "06-guardian.png") });
  await page.click("#modal-close");
  await sleep(300);

  // 每日运势页面
  await page.click('a[data-nav="daily"]');
  await sleep(600);
  await page.screenshot({ path: path.join(outDir, "07-daily.png") });

  // 十二生肖页面
  await page.click('a[data-nav="zodiac"]');
  await sleep(600);
  await page.screenshot({ path: path.join(outDir, "08-zodiac.png") });

  // 十二星座页面
  await page.click('a[data-nav="astro"]');
  await sleep(600);
  await page.screenshot({ path: path.join(outDir, "09-astro.png") });

  if (errors.length) {
    console.warn("\n页面控制台错误：");
    errors.forEach((e) => console.warn("  -", e));
  } else {
    console.log("\n✓ 未发现控制台错误");
  }

  console.log("\n所有截图已保存到 screenshots/ 目录");
} catch (err) {
  console.error("\n测试运行出错：", err);
  process.exitCode = 1;
} finally {
  await browser.close();
}
