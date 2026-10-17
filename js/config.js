/**
 * 灵爻集 · 外部 API 配置
 *
 * 此文件已入库，请勿在此填写私密 Key。
 * 本地开发时复制 js/config.local.example.js 为 js/config.local.js，
 * 在覆盖文件中填入自己的 Key（该文件已被 .gitignore 忽略）。
 * 未配置或部署环境无覆盖文件时，所有模块自动无缝降级为 js/data.js 中的本地备份数据。
 */

const defaults = {
  TIANAPI_KEY: "YOUR_API_KEY",
  TIANAPI_BASE: "https://apis.tianapi.com",
  // 一言（古风/诗词分类）与今日诗词
  HITOKOTO_URL: "https://v1.hitokoto.cn/?c=i",
  JINRISHICI_URL: "https://vistara.jinrishici.com/all.json",
  // 所有外部请求的统一超时（毫秒）
  API_TIMEOUT: 3000
};

// 本地覆盖文件（.gitignore 已忽略），不存在时静默使用默认值
// 先 HEAD 探测再 import；SPA 重写会把缺失文件回退为 index.html，
// 因此须校验 Content-Type 为 JavaScript 才执行 import
let local = {};
const localUrl = new URL("./config.local.js", import.meta.url);
try {
  const head = await fetch(localUrl, { method: "HEAD" });
  const ct = head.headers.get("content-type") || "";
  if (head.ok && ct.includes("javascript")) {
    local = await import(localUrl.href);
  }
} catch {
  /* 文件不存在或不可用时使用默认配置 */
}

export const TIANAPI_KEY = local.TIANAPI_KEY || defaults.TIANAPI_KEY;
export const TIANAPI_BASE = local.TIANAPI_BASE || defaults.TIANAPI_BASE;
export const HITOKOTO_URL = local.HITOKOTO_URL || defaults.HITOKOTO_URL;
export const JINRISHICI_URL = local.JINRISHICI_URL || defaults.JINRISHICI_URL;
export const API_TIMEOUT = local.API_TIMEOUT || defaults.API_TIMEOUT;
