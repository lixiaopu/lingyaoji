// 灵爻集 · 主程序
import {
  lingqianData,
  wuxingData,
  zodiacAnimals,
  westernZodiac,
  fortuneTexts,
  iconSvgs,
  poetryData,
  quoteData,
  lhlData,
  starIndexColors
} from "./data.js";
import {
  getLaohuangli,
  getStarFortune,
  getHitokoto,
  getJinrishici
} from "./api.js";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededRandom(seed) {
  return mulberry32(hashString(String(seed)));
}

function pick(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/* ===== 外部数据：实时 API + 本地降级 ===== */
const todayStr = new Date().toLocaleDateString("zh-CN");
const STEMS = "甲乙丙丁戊己庚辛壬癸";
const BRANCHES = "子丑寅卯辰巳午未申酉戌亥";
const ZODIAC_BY_BRANCH = "鼠牛虎兔龙蛇马羊猴鸡狗猪";

function ganzhiYear(year) {
  const i = (((year - 4) % 60) + 60) % 60;
  return STEMS[i % 10] + BRANCHES[i % 12];
}

// 日柱干支序号：1949-10-01 为甲子日（序号 0）
function dayGanzhiIndex(date) {
  const diff = Math.round(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(1949, 9, 1)) / 86400000
  );
  return ((diff % 60) + 60) % 60;
}

function ganzhiDay(date) {
  const i = dayGanzhiIndex(date);
  return STEMS[i % 10] + BRANCHES[i % 12];
}

function ymd(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function localLhl() {
  const now = new Date();
  const rng = seededRandom(`lhl-${todayStr}`);
  const picks = (pool, n) => {
    const set = new Set();
    while (set.size < n) set.add(pick(pool, rng));
    return [...set].join("·");
  };
  const dayIdx = dayGanzhiIndex(now);
  return {
    ganzhiYear: ganzhiYear(now.getFullYear()),
    ganzhiDay: ganzhiDay(now),
    yi: picks(lhlData.yiPool, 4),
    ji: picks(lhlData.jiPool, 3),
    shenwei: lhlData.gods.map((g) => `${g}：${pick(lhlData.directions, rng)}`).join(" "),
    chongsha: `${ZODIAC_BY_BRANCH[dayIdx % 12]}日冲${ZODIAC_BY_BRANCH[(dayIdx + 6) % 12]}`,
    lunar: ""
  };
}

function lhlHtml(d) {
  const ganzhi = [
    d.ganzhiYear && `${d.ganzhiYear}年`,
    d.ganzhiMonth && `${d.ganzhiMonth}月`,
    d.ganzhiDay && `${d.ganzhiDay}日`
  ].filter(Boolean).join(" ");
  const parts = [
    `<span><b>${escapeHtml(ganzhi)}</b>${d.lunar ? ` · 农历${escapeHtml(d.lunar)}` : ""}</span>`
  ];
  if (d.yi) parts.push(`<span class="lhl-yi">宜 ${escapeHtml(d.yi)}</span>`);
  if (d.ji) parts.push(`<span class="lhl-ji">忌 ${escapeHtml(d.ji)}</span>`);
  if (d.shenwei) parts.push(`<span>${escapeHtml(d.shenwei)}</span>`);
  if (d.chongsha) parts.push(`<span>${escapeHtml(d.chongsha)}</span>`);
  if (d.festival) parts.push(`<span>${escapeHtml(d.festival)}</span>`);
  return parts.join("");
}

// 先渲染本地黄历，API 成功后原位升级
function renderLhl() {
  const el = $("#lhl-strip");
  if (!el) return;
  el.innerHTML = lhlHtml(localLhl());
  getLaohuangli(ymd(new Date()))
    .then((d) => { el.innerHTML = lhlHtml(d); })
    .catch(() => {});
}

function poemHtml(p) {
  return `「${escapeHtml(p.content)}」<span class="poem-src">—— ${escapeHtml([p.dynasty, p.author].filter(Boolean).join("·"))}《${escapeHtml(p.title)}》</span>`;
}

// 先渲染本地诗词，API 成功后原位升级
function renderHeroPoem() {
  const el = $("#hero-poem");
  if (!el) return;
  el.innerHTML = poemHtml(pick(poetryData, seededRandom(`poem-${todayStr}`)));
  getJinrishici()
    .then((p) => { el.innerHTML = poemHtml(p); })
    .catch(() => {});
}

function quoteHtml(q) {
  return `${escapeHtml(q.text)}${q.from ? ` <em>—— ${escapeHtml(q.from)}</em>` : ""}`;
}

// 栏目顶部寄语：先放本地句，一言接口成功后替换
function fillBoardQuote(type) {
  const el = $(`#${type}-quote`);
  if (!el) return;
  el.innerHTML = quoteHtml(pick(quoteData, seededRandom(`quote-${type}-${Date.now()}`)));
  getHitokoto()
    .then((q) => { el.innerHTML = quoteHtml(q); })
    .catch(() => {});
}

// 星座卡片背面：首次翻开时实时拉取当日指数与评语
const starCache = new Map();

function localStarFortune(name) {
  const rng = seededRandom(`star-${name}-${todayStr}`);
  return {
    score: `${62 + Math.floor(rng() * 34)}%`,
    color: pick(starIndexColors, rng),
    summary: pick(fortuneTexts.overall, rng)
  };
}

async function ensureLiveFortune(card) {
  const slot = card.querySelector(".live-fortune");
  if (!slot || slot.dataset.done) return;
  slot.dataset.done = "1";
  slot.classList.add("loading");
  slot.textContent = "推演中…";

  const key = `star-${card.dataset.name}-${todayStr}`;
  if (!starCache.has(key)) {
    starCache.set(key, getStarFortune(card.dataset.name).catch(() => localStarFortune(card.dataset.name)));
  }
  const f = await starCache.get(key);
  if (!slot.isConnected) return;
  slot.classList.remove("loading");
  // 圆卡空间有限，评语截断到两行以内；完整评语放 title 悬停可见
  const brief = f.summary && f.summary.length > 18 ? `${f.summary.slice(0, 18)}…` : f.summary;
  slot.title = f.summary || "";
  slot.innerHTML = `<span class="score">综合 ${escapeHtml(f.score)}</span>${f.color ? ` · ${escapeHtml(f.color)}` : ""}<br>${escapeHtml(brief)}`;
}

/* ===== 路由切换 ===== */
function showSection(id) {
  $$(".page-section").forEach((sec) => sec.classList.remove("active"));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  $$(".main-nav a").forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === id);
  });

  const nav = $("#main-nav");
  const toggle = $("#nav-toggle");
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
}

function initNavigation() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-nav]");
    if (link) {
      e.preventDefault();
      showSection(link.dataset.nav);
    }
  });

  $("#nav-toggle").addEventListener("click", () => {
    const nav = $("#main-nav");
    const toggle = $("#nav-toggle");
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

/* ===== 弹窗 ===== */
function openModal(content) {
  const overlay = $("#modal-overlay");
  const body = $("#modal-body");
  const paper = $(".modal-paper");
  body.innerHTML = content;
  paper.scrollTop = 0;
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const overlay = $("#modal-overlay");
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function initModal() {
  $("#modal-close").addEventListener("click", closeModal);
  $("#modal-overlay").addEventListener("click", (e) => {
    if (e.target.id === "modal-overlay") closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

/* ===== 今日灵签 ===== */
let lastLingqianText = "";

function lingqianView() {
  return `
    <div class="text-center">
      <h3 class="modal-title" id="modal-title">今日灵签</h3>
      <p class="modal-subtitle">闭目静思，轻摇签筒，取一支今日签文</p>
      <div class="qian-stage">
        <div class="qian-tube" id="qian-tube">${iconSvgs.tube}</div>
        <div id="qian-result"></div>
        <button class="btn-seal" id="draw-lingqian" style="margin-top:8px;">摇签</button>
      </div>
    </div>
  `;
}

function renderLingqianResult(item, quote) {
  const levelMap = { ji: "上吉", zhong: "中平", xiong: "下签" };
  const levelClass = item.level === "ji" ? "ji" : item.level === "zhong" ? "zhong" : "xiong";
  lastLingqianText = `【灵爻集·今日灵签】\n${item.title} · ${levelMap[item.level]}\n${item.meaning}\n关键词：${item.keywords.join(" / ")}\n幸运色：${item.luckyColor}\n今日建议：${item.advice}\n寄语：${quote.text}${quote.from ? `（${quote.from}）` : ""}`;

  return `
    <div class="text-center" style="animation: sealStamp .6s ease;">
      <div class="result-seal">${escapeHtml(item.title.slice(0, 1))}</div>
      <h3 class="result-title">${escapeHtml(item.title)}</h3>
      <span class="result-level ${levelClass}">${levelMap[item.level]}</span>
      <p style="color:var(--ink-2);line-height:1.9;margin-bottom:18px;">${escapeHtml(item.meaning)}</p>
      <div class="result-keywords">
        ${item.keywords.map((k) => `<span>${escapeHtml(k)}</span>`).join("")}
      </div>
      <div class="result-color">
        <span class="color-dot" style="background:${item.colorHex}"></span>
        <span>幸运色：${escapeHtml(item.luckyColor)}</span>
      </div>
      <div class="result-advice">
        <strong>今日建议：</strong>${escapeHtml(item.advice)}
      </div>
      <p class="qian-quote">寄语 · ${escapeHtml(quote.text)}${quote.from ? `<em>—— ${escapeHtml(quote.from)}</em>` : ""}</p>
      <div class="qian-actions">
        <button class="btn-seal" id="redraw-lingqian">重新抽取</button>
        <button class="btn-ghost" id="copy-lingqian">复制分享</button>
      </div>
    </div>
  `;
}

function bindLingqianEvents() {
  $("#draw-lingqian").addEventListener("click", drawLingqian);
}

function drawLingqian() {
  const tube = $("#qian-tube");
  const btn = $("#draw-lingqian");
  const resultBox = $("#qian-result");

  btn.disabled = true;
  btn.textContent = "摇签中...";
  tube.classList.add("shake");
  resultBox.innerHTML = "";

  // 摇签动画期间并行请求一言，失败自动回退本地备选
  const quotePromise = getHitokoto().catch(() => pick(quoteData, seededRandom(`hitokoto-${Date.now()}`)));

  setTimeout(async () => {
    tube.classList.remove("shake");
    const item = lingqianData[Math.floor(Math.random() * lingqianData.length)];
    const quote = await quotePromise;
    resultBox.innerHTML = `
      <div class="ink-bloom"></div>
      <div class="qian-stick show">${escapeHtml(item.title)}</div>
      <div style="margin-top:12px;">${renderLingqianResult(item, quote)}</div>
    `;
    btn.style.display = "none";

    $("#redraw-lingqian").addEventListener("click", () => {
      resultBox.innerHTML = "";
      btn.style.display = "inline-flex";
      btn.disabled = false;
      btn.textContent = "摇签";
    });

    $("#copy-lingqian").addEventListener("click", () => {
      copyText(lastLingqianText, "#copy-lingqian", "已复制", "复制分享");
    });
  }, 1400);
}

async function copyText(text, selector, okText, originalText) {
  const btn = $(selector);
  if (!btn) return;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    const old = btn.textContent;
    btn.textContent = okText;
    setTimeout(() => (btn.textContent = originalText), 1600);
  } catch (err) {
    btn.textContent = "复制失败";
    setTimeout(() => (btn.textContent = originalText), 1600);
  }
}

/* ===== 五行测试 ===== */
function wuxingView() {
  return `
    <div>
      <h3 class="modal-title" id="modal-title">五行能量测试</h3>
      <p class="modal-subtitle">三个小问题，测出你当下更接近哪一种能量</p>
      <form id="wuxing-form">
        ${wuxingData.questions
          .map(
            (q, idx) => `
          <div class="quiz-item">
            <h4>${idx + 1}. ${escapeHtml(q.text)}</h4>
            <div class="quiz-options">
              ${q.options
                .map(
                  (opt) => `
                <label class="quiz-option" data-value="${escapeHtml(opt.value)}">
                  <input type="radio" name="${q.id}" value="${escapeHtml(opt.value)}" required>
                  <span>${escapeHtml(opt.text)}</span>
                </label>
              `
                )
                .join("")}
            </div>
          </div>
        `
          )
          .join("")}
        <div class="text-center mt-2">
          <button type="submit" class="btn-seal">查看结果</button>
        </div>
      </form>
      <div id="wuxing-result"></div>
    </div>
  `;
}

function bindWuxingEvents() {
  const form = $("#wuxing-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const counts = { 金: 0, 木: 0, 水: 0, 火: 0, 土: 0 };
    const data = new FormData(form);
    for (const [, value] of data) {
      counts[value] = (counts[value] || 0) + 1;
    }
    const element = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    showWuxingResult(element);
  });

  form.addEventListener("change", (e) => {
    const label = e.target.closest(".quiz-option");
    if (!label) return;
    const name = e.target.name;
    $$(`.quiz-option input[name="${name}"]`, form).forEach((input) => {
      input.closest(".quiz-option").classList.toggle("selected", input.checked);
    });
  });
}

function elementIconSvg(name, color) {
  return `<svg class="element-icon" viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="none" stroke="${color}" stroke-width="3"/><circle cx="60" cy="60" r="42" fill="${color}" fill-opacity="0.08"/><text x="60" y="70" text-anchor="middle" font-family="Noto Serif SC, serif" font-size="42" fill="${color}">${name}</text></svg>`;
}

function showWuxingResult(element) {
  const result = wuxingData.results[element];
  const resultBox = $("#wuxing-result");
  resultBox.innerHTML = `
    <div class="quiz-result" style="animation: sealStamp .6s ease;">
      ${elementIconSvg(element, result.color)}
      <h3 style="color:${result.color};font-size:1.5rem;margin-bottom:8px;">${escapeHtml(result.title)}</h3>
      <div class="element-tags">
        ${result.keywords.map((k) => `<span>${escapeHtml(k)}</span>`).join("")}
      </div>
      <div class="element-desc">
        <p>${escapeHtml(result.desc)}</p>
        <p><strong>今日指引：</strong>${escapeHtml(result.advice)}</p>
      </div>
      <button class="btn-ghost" id="restart-wuxing">重新测试</button>
    </div>
  `;
  $("#wuxing-form").style.display = "none";

  $("#restart-wuxing").addEventListener("click", () => {
    resultBox.innerHTML = "";
    const form = $("#wuxing-form");
    form.style.display = "block";
    form.reset();
    $$(".quiz-option").forEach((el) => el.classList.remove("selected"));
  });
}

/* ===== 守护生肖 ===== */
function guardianView() {
  return `
    <div>
      <h3 class="modal-title" id="modal-title">我的守护生肖</h3>
      <p class="modal-subtitle">输入出生年份，或点击下方属相快速生成专属解读</p>
      <div class="guardian-form">
        <input type="number" id="guardian-year" placeholder="例如 1995" min="1" max="2100">
        <button class="btn-seal" id="generate-by-year">按年份生成</button>
      </div>
      <div class="zodiac-selector" id="guardian-selector">
        ${zodiacAnimals
          .map(
            (z, i) => `
          <button class="zodiac-mini" data-index="${i}" aria-label="${escapeHtml(z.name)}">
            <div style="font-size:1.4rem;margin-bottom:2px;">${z.symbol}</div>
            <div>${escapeHtml(z.name)}</div>
          </button>
        `
          )
          .join("")}
      </div>
      <div id="guardian-result"></div>
    </div>
  `;
}

function getZodiacIndexByYear(year) {
  // 以鼠年为 0：公元 4 年为鼠年
  let y = parseInt(year, 10);
  if (!Number.isFinite(y)) return null;
  return ((y - 4) % 12 + 12) % 12;
}

function renderGuardianCard(index) {
  const z = zodiacAnimals[index];
  const selector = $("#guardian-selector");
  $$(".zodiac-mini").forEach((btn) => btn.classList.toggle("active", Number(btn.dataset.index) === index));

  $("#guardian-result").innerHTML = `
    <div class="guardian-card" style="animation: sealStamp .5s ease;">
      <div class="round-symbol">${z.symbol}</div>
      <h3>${escapeHtml(z.name)}年 · ${escapeHtml(z.name)}</h3>
      <p class="years">常见年份：${escapeHtml(z.years)}</p>
      <p><strong>性格底色：</strong>${escapeHtml(z.trait)}</p>
      <p><strong>今日指引：</strong>${escapeHtml(z.advice)}</p>
      <div class="element-tags" style="margin-top:14px;">
        <span>五行：${escapeHtml(z.element)}</span>
      </div>
    </div>
  `;
}

function bindGuardianEvents() {
  $("#generate-by-year").addEventListener("click", () => {
    const year = $("#guardian-year").value;
    const idx = getZodiacIndexByYear(year);
    if (idx === null) {
      alert("请输入有效的出生年份");
      return;
    }
    renderGuardianCard(idx);
  });

  $("#guardian-year").addEventListener("keydown", (e) => {
    if (e.key === "Enter") $("#generate-by-year").click();
  });

  $("#guardian-selector").addEventListener("click", (e) => {
    const btn = e.target.closest(".zodiac-mini");
    if (!btn) return;
    renderGuardianCard(Number(btn.dataset.index));
  });
}

/* ===== 运势板块 ===== */
function renderFortuneBoard(type, containerId, seedOverride) {
  const container = $(`#${containerId}`);
  const today = new Date().toLocaleDateString("zh-CN");
  const seed = seedOverride || `${type}-${today}`;
  const rng = seededRandom(seed);

  const dailyDate = $("#daily-date");
  if (dailyDate && type === "daily") {
    dailyDate.textContent = today;
  }

  let html = "";

  if (type === "daily") {
    html = [
      { key: "overall", title: "整体运势", icon: "sun" },
      { key: "love", title: "爱情运势", icon: "heart" },
      { key: "career", title: "事业运势", icon: "mountain" },
      { key: "wealth", title: "财富运势", icon: "coin" }
    ]
      .map((item) => fortuneCard(item.title, item.icon, fortuneTexts[item.key], rng))
      .join("");
  } else {
    const mapping = { love: "heart", career: "mountain", wealth: "coin" };
    html = fortuneCard(
      type === "love" ? "爱情指引" : type === "career" ? "事业指引" : "财富指引",
      mapping[type],
      fortuneTexts[type],
      rng
    );
  }

  container.innerHTML = html;
  fillBoardQuote(type);
}

function fortuneCard(title, iconKey, texts, rng) {
  const text = pick(texts, rng);
  const score = 3 + Math.floor(rng() * 3); // 3..5
  const dots = Array.from({ length: 5 }, (_, i) => `<span class="${i < score ? "on" : ""}"></span>`).join("");
  const tip = pick(
    [
      "运势如水墨，浓淡皆是心境。",
      "结果仅供娱乐，行动才是答案。",
      "把这份指引当作一份温柔的提醒。"
    ],
    rng
  );

  return `
    <article class="fortune-row">
      <header>
        <span class="fortune-icon">${iconSvgs[iconKey]}</span>
        <h3>${escapeHtml(title)}</h3>
        <span class="fortune-score" aria-label="能量值 ${score}">${dots}</span>
      </header>
      <p>${escapeHtml(text)}</p>
      <div class="fortune-tip">${escapeHtml(tip)}</div>
    </article>
  `;
}

function initFortuneButtons() {
  $("#daily-refresh").addEventListener("click", () => renderFortuneBoard("daily", "daily-board", Date.now()));
  $("#love-refresh").addEventListener("click", () => renderFortuneBoard("love", "love-board", Date.now()));
  $("#career-refresh").addEventListener("click", () => renderFortuneBoard("career", "career-board", Date.now()));
  $("#wealth-refresh").addEventListener("click", () => renderFortuneBoard("wealth", "wealth-board", Date.now()));
}

/* ===== 生肖 / 星座网格 ===== */
function renderCardGrid(containerId, items, type) {
  const container = $(`#${containerId}`);
  container.innerHTML = items
    .map((item) => {
      const meta = type === "zodiac" ? `五行：${item.element}` : `${item.dates}`;
      return `
        <div class="flip-card" data-name="${escapeHtml(item.name)}" tabindex="0" role="button" aria-label="查看${escapeHtml(item.name)}">
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <div class="round-symbol">${item.symbol}</div>
              <h3>${escapeHtml(item.name)}</h3>
              <div class="meta">${escapeHtml(meta)}</div>
            </div>
            <div class="flip-card-back">
              <h3>${escapeHtml(item.name)}</h3>
              ${type === "astro"
                ? '<div class="live-fortune"></div>'
                : `<div class="meta">${escapeHtml(meta)}</div><div class="trait">${escapeHtml(item.trait)}</div>`}
              <div class="trait" style="margin-top:8px;color:var(--cinnabar);">${escapeHtml(item.advice)}</div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  container.addEventListener("click", (e) => {
    const card = e.target.closest(".flip-card");
    if (!card) return;
    card.classList.toggle("flipped");
  });

  // 星座卡片首次翻开/悬停时拉取当日实时指数
  if (type === "astro") {
    $$(".flip-card", container).forEach((card) => {
      card.addEventListener("pointerenter", () => ensureLiveFortune(card), { once: true });
      card.addEventListener("focus", () => ensureLiveFortune(card), { once: true });
      card.addEventListener("click", () => ensureLiveFortune(card), { once: true });
    });
  }
}

/* ===== 入口卡片绑定 ===== */
function initPortals() {
  $$(".portal-item").forEach((card) => {
    card.addEventListener("click", () => {
      const mode = card.dataset.open;
      if (mode === "lingqian") {
        openModal(lingqianView());
        bindLingqianEvents();
      } else if (mode === "wuxing") {
        openModal(wuxingView());
        bindWuxingEvents();
      } else if (mode === "shengxiao") {
        openModal(guardianView());
        bindGuardianEvents();
      }
    });
  });
}

/* ===== 初始化 ===== */
function initTeaserIcons() {
  $$("[data-icon]").forEach((el) => {
    const key = el.dataset.icon;
    if (iconSvgs[key]) el.innerHTML = iconSvgs[key];
  });
}

function init() {
  initNavigation();
  initModal();
  initPortals();
  initTeaserIcons();
  initFortuneButtons();

  renderFortuneBoard("daily", "daily-board");
  renderFortuneBoard("love", "love-board");
  renderFortuneBoard("career", "career-board");
  renderFortuneBoard("wealth", "wealth-board");

  renderCardGrid("zodiac-grid", zodiacAnimals, "zodiac");
  renderCardGrid("astro-grid", westernZodiac, "astro");

  renderHeroPoem();
  renderLhl();

  // 默认首页
  if (location.hash) {
    const id = location.hash.replace("#", "");
    if (document.getElementById(id)) showSection(id);
  }
}

init();
