/**
 * 灵爻集 · 外部 API 接入层（带超时与异常兜底）
 *
 * 所有函数在失败时抛出异常，由调用方 catch 后回退到本地备份数据，
 * 保证页面在任何网络/配额/配置状态下都能稳定渲染。
 */

import {
  TIANAPI_KEY,
  TIANAPI_BASE,
  HITOKOTO_URL,
  JINRISHICI_URL,
  API_TIMEOUT
} from "./config.js";

export function tianapiReady() {
  return Boolean(TIANAPI_KEY) && TIANAPI_KEY !== "YOUR_API_KEY";
}

async function fetchJson(url, timeout = API_TIMEOUT) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function tianResult(json) {
  if (!json || json.code !== 200 || !json.result) {
    throw new Error((json && json.msg) || "tianapi error");
  }
  return json.result;
}

function splitTerms(text) {
  if (!text) return "";
  return String(text)
    .split(/[.·、,，\s]+/)
    .filter(Boolean)
    .join("·");
}

/* ===== 天行数据 · 老黄历 =====
 * 归一化为 { ganzhiYear, ganzhiMonth, ganzhiDay, yi, ji, shenwei, chongsha, lunar, festival, shengxiao }
 */
export async function getLaohuangli(dateStr) {
  if (!tianapiReady()) throw new Error("no tianapi key");
  const r = tianResult(
    await fetchJson(`${TIANAPI_BASE}/lunar/index?key=${TIANAPI_KEY}&date=${dateStr}`)
  );
  // 兼容 result 为对象或数组两种结构
  const d = Array.isArray(r) ? r[0] : Array.isArray(r.list) ? r.list[0] : r;
  if (!d) throw new Error("empty lhl result");

  return {
    ganzhiYear: d.tiangandizhiyear || d.year_gz || "",
    ganzhiMonth: d.tiangandizhimonth || d.month_gz || "",
    ganzhiDay: d.tiangandizhiday || d.day_gz || "",
    yi: splitTerms(d.fitness || d.suitable),
    ji: splitTerms(d.taboo || d.avoid),
    shenwei: (d.shenwei || "").trim(),
    chongsha: d.chongsha || (d.chong ? `冲 ${d.chong}` : ""),
    lunar: [d.lubarmonth, d.lunarday].filter(Boolean).join("") || d.lunar_date || "",
    festival: d.festival || d.lunar_festival || "",
    shengxiao: d.shengxiao || d.zodiac || ""
  };
}

/* ===== 天行数据 · 星座今日运势 =====
 * result.list 为 [{type, content}]，归一化为 { score, color, number, friend, summary, ... }
 */
export async function getStarFortune(astroName) {
  if (!tianapiReady()) throw new Error("no tianapi key");
  const r = tianResult(
    await fetchJson(
      `${TIANAPI_BASE}/star/index?key=${TIANAPI_KEY}&astro=${encodeURIComponent(astroName)}`
    )
  );
  const list = Array.isArray(r) ? r : r.list;
  if (!Array.isArray(list) || !list.length) throw new Error("empty star result");

  const map = {};
  for (const item of list) {
    if (item && item.type && item.content) map[item.type] = item.content;
  }
  const summary = map["今日概述"] || map["运势简评"] || map["简评"] || "";
  if (!summary && !map["综合指数"]) throw new Error("empty star content");

  return {
    score: map["综合指数"] || "",
    love: map["爱情指数"] || "",
    work: map["工作指数"] || "",
    money: map["财运指数"] || "",
    health: map["健康指数"] || "",
    color: map["幸运颜色"] || map["幸运色"] || "",
    number: map["幸运数字"] || "",
    friend: map["贵人星座"] || "",
    summary
  };
}

/* ===== 一言 · 古风/禅意短句 ===== */
export async function getHitokoto() {
  const json = await fetchJson(HITOKOTO_URL);
  if (!json || !json.hitokoto) throw new Error("empty hitokoto");
  return { text: json.hitokoto, from: json.from_who || json.from || "" };
}

/* ===== 今日诗词 ===== */
export async function getJinrishici() {
  const json = await fetchJson(JINRISHICI_URL);
  const d = json && json.data;
  if (!d || !d.content || !d.origin) throw new Error("empty jinrishici");
  return {
    content: d.content,
    title: d.origin.title || "",
    author: d.origin.author || "",
    dynasty: d.origin.dynasty || ""
  };
}
