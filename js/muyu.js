/**
 * 灵爻集 · 电子木鱼（解压小彩蛋）
 *
 * 页面右下角的极简水墨木鱼：
 * - 点击时木鱼轻微缩放、槌子落下敲击；
 * - 点击处向上浮现淡墨文字（功德+1 / 烦恼-1 / 心静+1）；
 * - 页面点击处的水墨晕开由 ink-cursor.js 全局监听，自动触发；
 * - 附带一声极轻的合成木鱼声（WebAudio，无需音频资源）。
 */

const PHRASES = ["功德+1", "烦恼-1", "心静+1"];

const fish = document.getElementById("muyu");
if (fish) {
  let audioCtx = null;

  function knock() {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const t = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(860, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.09);
      gain.gain.setValueAtTime(0.11, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.11);
    } catch (_) {
      /* 音频不可用时静默跳过 */
    }
  }

  function spawnFloatText(x, y) {
    const el = document.createElement("span");
    el.className = "muyu-float";
    el.textContent = PHRASES[Math.floor(Math.random() * PHRASES.length)];
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }

  fish.addEventListener("click", (e) => {
    fish.classList.remove("tap");
    void fish.offsetWidth;
    fish.classList.add("tap");

    const rect = fish.getBoundingClientRect();
    const x = e.clientX || rect.left + rect.width / 2;
    const y = e.clientY || rect.top;
    spawnFloatText(x, y);

    knock();
  });
}
